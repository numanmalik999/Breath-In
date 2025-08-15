// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const TO_EMAIL = 'numan_malik999@yahoo.com';
// IMPORTANT: For this to work in production, you must verify a domain with Resend
// and use an email from that domain (e.g., 'noreply@yourdomain.com').
// For now, we can use the default Resend testing address.
const FROM_EMAIL = 'onboarding@resend.dev'; 

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set in Supabase secrets. The form will not work until it is added.');
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      throw new Error('Missing required fields: name, email, or message.');
    }

    const resendPayload = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p>You have a new contact form submission from your Breathin website.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      reply_to: email,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
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