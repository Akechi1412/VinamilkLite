import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  AboutPage,
  AccountPage,
  AddressPage,
  CheckoutPage,
  CollectionPage,
  ContactPage,
  HomePage,
  LoginPage,
  NewsPage,
  NotFoundPage,
  OrdersPage,
  ProductsPage,
  ProfilePage,
  RegisterPage,
  SearchPage,
} from './pages/common';
import {
  AdminDashboardPage,
  AdminLoginPage,
  AdminUsersPage,
  AdminProductsPage,
  AdminProductTypesPage,
  AdminCollectionsPage,
  AdminBrandsPage,
  AdminCommentsPage,
  AdminPackingPage,
  AdminNewsPage,
  AdminContactsPage,
  AdminOrdersPage,
  AdminOptionsPage,
} from './pages/admin';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/collections/all-products" element={<ProductsPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/products/:slug" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
          <Route path="product-types" element={<AdminProductTypesPage />} />
          <Route path="collections" element={<AdminCollectionsPage />} />
          <Route path="packing" element={<AdminPackingPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="options" element={<AdminOptionsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
