import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess.jsx';  // Make sure the extension is .jsx

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51O1TiuSIYdbve5xsa4Ek3ogB72c0PsuNcqsURbFXWsUPHkT0vMQZUmk8gmIvrKrBxNklToAqAQnFR3cfy0Livee700SWLFqomF'); // Replace with your actual publishable key

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Elements stripe={stripePromise}>
            <Signup />
          </Elements>
        } />
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route path="add" element={<Add url={url} />} />
          <Route path="list" element={<List url={url} />} />
          <Route path="orders" element={<Orders url={url} />} />
        </Route>

        {/* Payment Success Route */}
        <Route path="/payment-success" element={<PaymentSuccess />} />  {/* New Route for Payment Success */}
      </Routes>
    </div>
  );
};

export default App;
