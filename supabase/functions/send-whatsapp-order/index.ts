// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'Rs 0';
  return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error('Missing orderId.');

    // --- Get Secrets ---
    const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      throw new Error('WhatsApp API credentials are not set in Supabase secrets.');
    }

    // --- Create Supabase Admin Client ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- Fetch Settings ---
    const { data: settingsData, error: settingsError } = await supabaseAdmin.from('settings').select('key, value');
    if (settingsError) throw settingsError;
    const settings = settingsData.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});
    const ADMIN_WHATSAPP_NUMBER = settings.admin_whatsapp_number;
    const TEMPLATE_NAME = settings.whatsapp_template_name;
    if (!ADMIN_WHATSAPP_NUMBER || !TEMPLATE_NAME) {
      throw new Error('Admin WhatsApp number or template name is not set in the store settings.');
    }

    // --- Fetch Order and Customer Details ---
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, profiles(first_name, last_name, phone_number), order_items(quantity, products(name))')
      .eq('id', orderId)
      .single();
    if (orderError) throw orderError;

    // --- Prepare Template Parameters ---
    const customerName = `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim();
    const itemsList = order.order_items.map(item => `- ${item.products.name} (x${item.quantity})`).join('\\n');

    const params = [
      { type: 'text', text: `#${order.id.substring(0, 8)}` },
      { type: 'text', text: customerName || 'N/A' },
      { type: 'text', text: order.profiles.phone_number || 'N/A' },
      { type: 'text', text: itemsList },
      { type: 'text', text: formatCurrency(order.total_amount) },
    ];

    // --- Construct and Send API Request to Meta ---
    const response = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: ADMIN_WHATSAPP_NUMBER,
        type: 'template',
        template: {
          name: TEMPLATE_NAME,
          language: { code: 'en_US' },
          components: [{ type: 'body', parameters: params }],
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Meta API Error:', errorBody);
      throw new Error(`Failed to send WhatsApp message. Status: ${response.status}`);
    }

    return new Response(JSON.stringify({ message: 'WhatsApp notification sent successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-whatsapp-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});