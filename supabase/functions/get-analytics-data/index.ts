// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all orders and profiles
    const { data: ordersData, error: ordersError } = await supabaseAdmin.from('orders').select('total_amount, created_at');
    if (ordersError) throw ordersError;

    const { data: profilesData, error: profilesError } = await supabaseAdmin.from('profiles').select('created_at');
    if (profilesError) throw profilesError;

    // --- Calculate Totals ---
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = ordersData.length;
    const totalCustomers = profilesData.length;

    // --- Calculate Change vs Previous 30 Days ---
    const now = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(new Date().setDate(now.getDate() - 60));

    const currentPeriodOrders = ordersData.filter(o => new Date(o.created_at) >= thirtyDaysAgo);
    const previousPeriodOrders = ordersData.filter(o => new Date(o.created_at) >= sixtyDaysAgo && new Date(o.created_at) < thirtyDaysAgo);
    
    const currentPeriodCustomers = profilesData.filter(p => new Date(p.created_at) >= thirtyDaysAgo);
    const previousPeriodCustomers = profilesData.filter(p => new Date(p.created_at) >= sixtyDaysAgo && new Date(p.created_at) < thirtyDaysAgo);

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(
      currentPeriodOrders.reduce((sum, o) => sum + o.total_amount, 0),
      previousPeriodOrders.reduce((sum, o) => sum + o.total_amount, 0)
    );
    const ordersChange = calculateChange(currentPeriodOrders.length, previousPeriodOrders.length);
    const customersChange = calculateChange(currentPeriodCustomers.length, previousPeriodCustomers.length);

    // --- Sales Trend Data (last 6 months) ---
    const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6));
    const recentOrders = ordersData.filter(o => new Date(o.created_at) >= sixMonthsAgo);
    
    const salesByMonth = Array(6).fill(0).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return { month: d.toLocaleString('default', { month: 'short' }), sales: 0 };
    }).reverse();

    recentOrders.forEach(order => {
        const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
        const monthIndex = salesByMonth.findIndex(m => m.month === month);
        if (monthIndex > -1) {
            salesByMonth[monthIndex].sales += order.total_amount;
        }
    });

    const analyticsData = {
      revenue: { value: totalRevenue, change: revenueChange },
      orders: { value: totalOrders, change: ordersChange },
      customers: { value: totalCustomers, change: customersChange },
      salesData: salesByMonth,
    };

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})