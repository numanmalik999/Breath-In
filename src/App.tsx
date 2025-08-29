import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import { CartProvider, useCart } from './context/CartContext'; // Import useCart
import { AuthProvider } from './context/AuthContext';
import { SearchProvider, useSearch } from './context/SearchContext'; // Import useSearch
import { SettingsProvider } from './context/SettingsContext';
import AdminRoute from './components/AdminRoute';
import CartSlider from './components/CartSlider';
import SearchModal from './components/SearchModal';
import AnnouncementBar from './components/AnnouncementBar';
import WhatsAppButton from './components/WhatsAppButton';

const PublicLayout = () => {
  const { state: { isCartOpen } } = useCart(); // Get cart open state
  const { isSearchOpen } = useSearch(); // Get search open state

  return (
    <>
      <AnnouncementBar />
      <Header />
      {isCartOpen && <CartSlider />} {/* Only render CartSlider if it's open */}
      {isSearchOpen && <SearchModal />} {/* Only render SearchModal if it's open */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <SearchProvider>
              <div className="min-h-screen bg-warmBeige flex flex-col">
                <Toaster position="top-center" reverseOrder={false} />
                <Routes>
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products/new" element={<ProductFormPage />} />
                    <Route path="/admin/products/edit/:slug" element={<ProductFormPage />} />
                  </Route>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:categorySlug" element={<ShopPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
                  </Route>
                </Routes>
              </div>
            </SearchProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;