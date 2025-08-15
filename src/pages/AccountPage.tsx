import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { User, ShoppingBag, LogOut, Save, Package, Calendar, Hash, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

const ProfileSection = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhoneNumber(profile.phone_number || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Error updating profile. Please try again.');
      console.error(error);
    } else {
      setMessage('Profile updated successfully!');
      await refreshProfile();
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-charcoal">My Profile</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex items-center space-x-4">
          <button type="submit" disabled={loading} className="bg-sageGreen text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center space-x-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </form>
    </div>
  );
};

const OrderHistorySection = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) console.error('Error fetching orders:', error);
        else setOrders(data || []);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  if (loading) return <p>Loading order history...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-charcoal">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center border-2 border-dashed rounded-lg p-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">No Orders Yet</h3>
          <p className="mt-2 text-gray-600">When you place an order, it will appear here.</p>
          <Link to="/shop" className="mt-6 inline-block bg-sageGreen text-white px-5 py-2 rounded-lg font-medium hover:bg-opacity-90">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Hash className="h-4 w-4" />
                      <span>Order #{order.id.substring(0, 8)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const AccountPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!session) return null;

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif text-charcoal mb-8">My Account</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === item.id ? 'bg-sageGreen text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </nav>
        </aside>
        <main className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'orders' && <OrderHistorySection />}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;