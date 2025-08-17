// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId, status, trackingNumber, courier } = await req.json();
    if (!orderId) throw new Error("Order ID is required");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch current order details to check for changes
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('status, tracking_number, user_id')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;

    const statusChanged = status && status !== currentOrder.status;
    const trackingAdded = trackingNumber && trackingNumber !== currentOrder.tracking_number;

    // 2. Prepare and execute the update
    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;
    if (courier) updateData.courier = courier;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No update data provided");
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) throw updateError;

    // 3. If status changed or tracking was added, send an email notification
    if (statusChanged || trackingAdded) {
      if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set. Skipping email notification.');
      } else {
        // Fetch user email and settings
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(currentOrder.user_id);
        if (userError) throw userError;
        
        const { data: settingsData, error: settingsError } = await supabaseAdmin.from('settings').select('key, value');
        if (settingsError) throw settingsError;
        
        const settings = settingsData.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});
        const FROM_EMAIL = settings.sender_email || 'onboarding@resend.dev';
        const STORE_NAME = settings.store_name || 'Breathin';
        
        const customerEmail = user.email;
        const customerFirstName = user.user_metadata.first_name || 'Valued Customer';

        let subject = `Update on your ${STORE_NAME} order #${orderId.substring(0, 8)}`;
        let emailBody = `<p>Hi ${customerFirstName},</p><p>There's an update on your order.</p>`;
        
        if (statusChanged) {
          subject = `Your ${STORE_NAME} order is now ${status}`;
          emailBody += `<p>Your order status has been updated to: <strong>${status}</strong>.</p>`;
        }

        if (trackingNumber) {
          emailBody += `<p>Your tracking number is: <strong>${trackingNumber}</strong>.</p>`;
          if (courier) {
            emailBody += `<p>Your courier is: <strong>${courier}</strong>.</p>`;
          }
        }
        
        emailBody += `<p>Thank you for shopping with us!</p><p>The ${STORE_NAME} Team</p>`;

        // Send email via Resend
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: `${STORE_NAME} <${FROM_EMAIL}>`,
            to: [customerEmail],
            subject: subject,
            html: emailBody,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ message: "Order updated successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})