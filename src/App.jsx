import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AccountLayout from "./components/account/AccountLayout.jsx";

import PublicHome from "./pages/PublicHome.jsx";
import Menu from "./pages/Menu.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";

import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Payment from "./pages/Payment.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Orders from "./pages/Orders.jsx";
import Favorites from "./pages/Favorites.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";

import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AccountCreated from "./pages/auth/AccountCreated.jsx";

import Account from "./pages/account/Account.jsx";
import AccountSettings from "./pages/account/AccountSettings.jsx";
import AccountAddresses from "./pages/account/AccountAddresses.jsx";
import AccountPaymentMethods from "./pages/account/AccountPaymentMethods.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ---- Public ---- */}
        <Route index element={<PublicHome />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:productId" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<Terms />} />

        {/* ---- Commerce ---- */}
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<Payment />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:reference" element={<OrderDetail />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="favorites" element={<Favorites />} />

        {/* ---- Auth ---- */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route
          path="account-created"
          element={
            <ProtectedRoute>
              <AccountCreated />
            </ProtectedRoute>
          }
        />

        {/* ---- Account area ---- */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Account />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="payment-methods" element={<AccountPaymentMethods />} />
        </Route>

        {/* 404 catch-all ---- */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
