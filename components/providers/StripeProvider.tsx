'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState, useEffect, createContext, useContext } from 'react';

// Создаем контекст для Stripe
interface StripeContextType {
  stripe: Stripe | null;
  loading: boolean;
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  loading: true,
});

// Хук для использования Stripe в компонентах
export const useStripe = () => useContext(StripeContext);

// Создаем экземпляр Stripe вне компонента для избежания повторной инициализации
const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PK_TEST;
  if (!key) {
    console.error('Stripe publishable key is missing. Please check your environment variables.');
    return null;
  }
  return loadStripe(key);
};

export default function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Инициализируем Stripe только на клиентской стороне
    const initializeStripe = async () => {
      try {
        const stripeInstance = await getStripePromise();
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  return <StripeContext.Provider value={{ stripe, loading }}>{children}</StripeContext.Provider>;
}
