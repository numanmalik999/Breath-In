// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId, status, trackingNumber } = await req.json();
    if (!orderId) throw new Error("Order ID is required");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No update data provided");
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) throw error;

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