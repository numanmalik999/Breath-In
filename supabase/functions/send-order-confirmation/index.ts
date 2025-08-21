// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'Rs 0';
  return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set.');
    }

    const { orderId } = await req.json();
    if (!orderId) throw new Error('Missing orderId.');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Fetch settings
    const { data: settingsData, error: settingsError } = await supabaseAdmin.from('settings').select('key, value');
    if (settingsError) throw settingsError;
    const settings = settingsData.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});

    const ADMIN_EMAIL = settings.admin_notification_email || 'numan_malik999@yahoo.com';
    const FROM_EMAIL = settings.sender_email || 'onboarding@resend.dev';
    const STORE_NAME = settings.store_name || 'Breathin';

    // Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single();
    if (orderError) throw orderError;

    // Get customer email from the order itself
    const customerEmail = order.customer_email;
    if (!customerEmail) {
      throw new Error(`Order ${orderId} does not have a customer email.`);
    }
    const customerFirstName = order.customer_name?.split(' ')[0] || 'Valued Customer';

    // Fetch order items
    const { data: items, error: itemsError } = await supabaseAdmin.from('order_items').select('quantity, price, product:products(name)').eq('order_id', orderId);
    if (itemsError) throw itemsError;

    const itemsHtml = items.map(item => `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name} (x${item.quantity})</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price * item.quantity)}</td></tr>`).join('');

    const customerEmailHtml = `<h1>Thank you for your order!</h1><p>Hi ${customerFirstName}, we've received your order #${order.id.substring(0, 8)}.</p><h2>Order Summary</h2><table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table><p style="text-align: right;"><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p><p style="text-align: right;"><strong>Discount:</strong> -${formatCurrency(order.discount)}</p><p style="text-align: right;"><strong>Shipping:</strong> ${formatCurrency(order.shipping_cost)}</p><h3 style="text-align: right;">Total: ${formatCurrency(order.total_amount)}</h3><p>We'll notify you when your order has shipped.</p>`;
    const adminEmailHtml = `<h1>New Order Received!</h1><p>A new order has been placed on ${STORE_NAME}.</p><h2>Order #${order.id.substring(0, 8)}</h2><p><strong>Customer:</strong> ${customerEmail}</p><table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table><h3 style="text-align: right;">Total: ${formatCurrency(order.total_amount)}</h3><p>Please process this order in the admin dashboard.</p>`;

    // Send email to customer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: `${STORE_NAME} <${FROM_EMAIL}>`, to: [customerEmail], subject: `Your ${STORE_NAME} Order Confirmation #${order.id.substring(0, 8)}`, html: customerEmailHtml }),
    });

    // Send email to admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: `${STORE_NAME} Store <${FROM_EMAIL}>`, to: [ADMIN_EMAIL], subject: `New Order Notification #${order.id.substring(0, 8)}`, html: adminEmailHtml }),
    });

    return new Response(JSON.stringify({ message: 'Emails sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-order-confirmation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});