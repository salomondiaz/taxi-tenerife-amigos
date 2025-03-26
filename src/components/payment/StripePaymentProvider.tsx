
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Inicializar Stripe (clave pública)
const stripePromise = loadStripe('pk_test_51O3jYkKnLtKx8u1pHWj2lUqIOBmzGq6X3EGFh3aVRQDDuTDUGNY90XtHUZDwg3cIqtLqsaAVWcmRBZB9V5UxtWDw00LXjTwZxN');

interface StripePaymentProviderProps {
  children: React.ReactNode;
}

const StripePaymentProvider: React.FC<StripePaymentProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripePaymentProvider;
