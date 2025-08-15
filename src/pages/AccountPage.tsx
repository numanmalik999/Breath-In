import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ShoppingBag } from 'lucide-react';

const AccountPage = () => {
  const { user, signOut, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-serif text-charcoal mb-6">My Account</h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-5 w-5 text-gray-500" />
            <a href="#" className="text-sageGreen hover:underline">
              View Order History
            </a>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <button
            onClick={signOut}
            className="w-full md:w-auto bg-terracotta text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;