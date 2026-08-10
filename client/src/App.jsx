import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Customer Components
import Header from './components/Header';
import Footer from './components/Footer';
import { ProtectedAdminRoute, ProtectedCustomerRoute } from './components/ProtectedRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductPage from './pages/customer/ProductPage';
import AboutPage from './pages/customer/AboutPage';
import FarmPage from './pages/customer/FarmPage';
import GalleryPage from './pages/customer/GalleryPage';
import ContactPage from './pages/customer/ContactPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import AccountPage from './pages/customer/AccountPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import WishlistPage from './pages/customer/WishlistPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import CategoryList from './pages/admin/CategoryList';
import InventoryPage from './pages/admin/InventoryPage';
import OrderList from './pages/admin/OrderList';
import OrderDetail from './pages/admin/OrderDetail';
import CustomerList from './pages/admin/CustomerList';
import CustomerDetail from './pages/admin/CustomerDetail';
import CouponList from './pages/admin/CouponList';
import ReviewList from './pages/admin/ReviewList';
import BannerList from './pages/admin/BannerList';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import ContentPage from './pages/admin/ContentPage';
import FarmContent from './pages/admin/FarmContent';
import MessageList from './pages/admin/MessageList';
import ReportsPage from './pages/admin/ReportsPage';
import BusinessSettings from './pages/admin/BusinessSettings';
import EcommerceSettings from './pages/admin/EcommerceSettings';
import ShippingSettings from './pages/admin/ShippingSettings';
import PaymentSettings from './pages/admin/PaymentSettings';
import AdminProfile from './pages/admin/AdminProfile';

function CustomerLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Customer Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/categories" element={<ShopPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/farm" element={<FarmPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Customer Routes */}
                <Route path="/account" element={<ProtectedCustomerRoute><AccountPage /></ProtectedCustomerRoute>} />
                <Route path="/account/orders" element={<ProtectedCustomerRoute><OrdersPage /></ProtectedCustomerRoute>} />
                <Route path="/account/orders/:id" element={<ProtectedCustomerRoute><OrderDetailPage /></ProtectedCustomerRoute>} />
                <Route path="/account/wishlist" element={<ProtectedCustomerRoute><WishlistPage /></ProtectedCustomerRoute>} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/products" element={<ProtectedAdminRoute><ProductList /></ProtectedAdminRoute>} />
              <Route path="/admin/products/new" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
              <Route path="/admin/products/:id/edit" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
              <Route path="/admin/categories" element={<ProtectedAdminRoute><CategoryList /></ProtectedAdminRoute>} />
              <Route path="/admin/inventory" element={<ProtectedAdminRoute><InventoryPage /></ProtectedAdminRoute>} />
              <Route path="/admin/orders" element={<ProtectedAdminRoute><OrderList /></ProtectedAdminRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedAdminRoute><OrderDetail /></ProtectedAdminRoute>} />
              <Route path="/admin/customers" element={<ProtectedAdminRoute><CustomerList /></ProtectedAdminRoute>} />
              <Route path="/admin/customers/:id" element={<ProtectedAdminRoute><CustomerDetail /></ProtectedAdminRoute>} />
              <Route path="/admin/coupons" element={<ProtectedAdminRoute><CouponList /></ProtectedAdminRoute>} />
              <Route path="/admin/reviews" element={<ProtectedAdminRoute><ReviewList /></ProtectedAdminRoute>} />
              <Route path="/admin/banners" element={<ProtectedAdminRoute><BannerList /></ProtectedAdminRoute>} />
              <Route path="/admin/gallery" element={<ProtectedAdminRoute><GalleryAdmin /></ProtectedAdminRoute>} />
              <Route path="/admin/content" element={<ProtectedAdminRoute><ContentPage /></ProtectedAdminRoute>} />
              <Route path="/admin/content/farm" element={<ProtectedAdminRoute><FarmContent /></ProtectedAdminRoute>} />
              <Route path="/admin/messages" element={<ProtectedAdminRoute><MessageList /></ProtectedAdminRoute>} />
              <Route path="/admin/reports" element={<ProtectedAdminRoute><ReportsPage /></ProtectedAdminRoute>} />
              <Route path="/admin/settings/business" element={<ProtectedAdminRoute><BusinessSettings /></ProtectedAdminRoute>} />
              <Route path="/admin/settings/ecommerce" element={<ProtectedAdminRoute><EcommerceSettings /></ProtectedAdminRoute>} />
              <Route path="/admin/settings/shipping" element={<ProtectedAdminRoute><ShippingSettings /></ProtectedAdminRoute>} />
              <Route path="/admin/settings/payment" element={<ProtectedAdminRoute><PaymentSettings /></ProtectedAdminRoute>} />
              <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />
            </Routes>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
