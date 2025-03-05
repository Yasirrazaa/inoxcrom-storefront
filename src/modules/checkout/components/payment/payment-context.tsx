"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';

interface PaymentContextProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  cardComplete: boolean;
  setCardComplete: (complete: boolean) => void;
  cardBrand: string | null;
  setCardBrand: (brand: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  cardHolderName: string;
  setCardHolderName: (name: string) => void;
  isReadyForOrder: boolean;
  setIsReadyForOrder: (ready: boolean) => void;
  stripeFormComplete: boolean;
  setStripeFormComplete: (complete: boolean) => void;
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined);

interface PaymentProviderProps {
  children: React.ReactNode;
}

const logPaymentState = (label: string, state: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PaymentContext] ${label}:`, state);
  }
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [isReadyForOrder, setIsReadyForOrder] = useState(false);
  const [stripeFormComplete, setStripeFormComplete] = useState(false);

  // Log state changes in development
  useEffect(() => {
    logPaymentState('Payment method changed', {
      method: selectedPaymentMethod,
      wasCardComplete: cardComplete,
      cardBrand,
      hadError: !!error
    });
  }, [selectedPaymentMethod]);

  useEffect(() => {
    logPaymentState('Card state changed', {
      complete: cardComplete,
      brand: cardBrand,
      hasName: !!cardHolderName,
      nameLength: cardHolderName.length
    });
  }, [cardComplete, cardBrand, cardHolderName]);

  // Validate payment readiness
  useEffect(() => {
    const previousState = isReadyForOrder;
    
    // Handle stripe-specific validation
    if (selectedPaymentMethod === 'stripe') {
      const isValid = cardComplete && cardHolderName.trim().length >= 2;
      setIsReadyForOrder(isValid);
      
      // Set appropriate error message
      if (!cardHolderName.trim() && cardComplete) {
        setError('Please enter card holder name');
      } else if (cardHolderName.trim().length === 1) {
        setError('Name must be at least 2 characters');
      } else if (!cardComplete) {
        setError('Please complete card details');
      } else {
        setError(null);
      }

      logPaymentState('Stripe validation', {
        isValid,
        hasName: !!cardHolderName.trim(),
        nameLength: cardHolderName.trim().length,
        cardComplete,
        previousState,
        newState: isValid
      });
    } else {
      // Reset error if not using Stripe
      setError(null);
      setIsReadyForOrder(true);
    }
  }, [cardHolderName, selectedPaymentMethod, cardComplete, stripeFormComplete]);

  // Reset form when payment method changes
  useEffect(() => {
    if (selectedPaymentMethod !== 'stripe') {
      setCardComplete(false);
      setCardBrand(null);
      setStripeFormComplete(false);

      logPaymentState('Form reset', {
        newMethod: selectedPaymentMethod
      });
    }
  }, [selectedPaymentMethod]);

  const value = {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    cardComplete,
    setCardComplete,
    cardBrand,
    setCardBrand,
    error,
    setError,
    cardHolderName,
    setCardHolderName,
    isReadyForOrder,
    setIsReadyForOrder,
    stripeFormComplete,
    setStripeFormComplete
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
