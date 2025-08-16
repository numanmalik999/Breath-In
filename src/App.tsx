import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { SettingsProvider } from './context/SettingsContext';
import AdminRoute from './components/AdminRoute';
import CartSlider from './components/CartSlider';
import SearchModal from './components/SearchModal';
import AnnouncementBar from './components/AnnouncementBar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <SearchProvider>
              <div className="min-h-screen bg-warmBeige flex flex-col">
                <AnnouncementBar />
                <Header />
                <CartSlider />
                <SearchModal />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:categorySlug" element={<ShopPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            </SearchProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;