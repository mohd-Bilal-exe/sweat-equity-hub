import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { backendAPI } from '@/api/backend';
import { getAuth } from 'firebase/auth';

const stripePromise = loadStripe('pk_test_your_publishable_key_here'); // Replace with your publishable key

function CheckoutForm({ userId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const { clientSecret } = await backendAPI.createSubscription(userId, token);

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await backendAPI.confirmPayment(paymentIntent.id, token);
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
          },
        }} />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : 'Subscribe $20/month'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function StripeCheckout({ userId, onSuccess, onCancel }) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Subscribe to Premium</h3>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            userId={userId} 
            onSuccess={onSuccess} 
            onCancel={onCancel} 
          />
        </Elements>
      </CardContent>
    </Card>
  );
}