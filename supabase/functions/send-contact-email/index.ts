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
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in Supabase secrets.');
    }

    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      throw new Error('Missing required fields: name, email, or message.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch email settings
    const { data: settingsData, error: settingsError } = await supabaseAdmin.from('settings').select('key, value');
    if (settingsError) throw settingsError;
    const settings = settingsData.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});

    const TO_EMAIL = settings.admin_notification_email || 'numan_malik999@yahoo.com';
    const FROM_EMAIL = settings.sender_email || 'onboarding@resend.dev';

    const resendPayload = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      reply_to: email,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify(resendPayload),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error('Resend API Error:', errorBody);
      throw new Error('Failed to send email.');
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})