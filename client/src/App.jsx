import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  AboutPage,
  AccountPage,
  AddressPage,
  CheckoutPage,
  ContactPage,
  HomePage,
  LoginPage,
  NewsDetailPage,
  NewsPage,
  NotFoundPage,
  OrdersPage,
  ProductDetailPage,
  ProductsPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
  SearchPage,
} from './pages/common';
import {
  AdminDashboardPage,
  AdminLoginPage,
  AdminUsersPage,
  AdminProductsPage,
  AdminCollectionsPage,
  AdminCommentsPage,
  AdminNewsPage,
  AdminContactsPage,
  AdminOrdersPage,
  AdminOptionsPage,
  AdminProfilePage,
  AdminNewsCategoriesPage,
} from './pages/admin';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news-categories/:slug" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/collections/:slug" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account" element={<AccountPage />}>
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="address" element={<AddressPage />} />
        </Route>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="collections" element={<AdminCollectionsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="news-categories" element={<AdminNewsCategoriesPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="options" element={<AdminOptionsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
