import { toast } from '../components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const backendAPI = {
  async createSubscription(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Subscription created successfully' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to create subscription', variant: 'destructive' });
      }
      
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
      throw error;
    }
  },

  async confirmPayment(paymentIntentId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentIntentId })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Payment confirmed successfully' });
      } else {
        toast({ title: 'Error', description: data.message || 'Payment confirmation failed', variant: 'destructive' });
      }
      
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
      throw error;
    }
  },

  async getSubscriptionStatus(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/subscription/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        toast({ title: 'Error', description: data.message || 'Failed to get subscription status', variant: 'destructive' });
      }
      
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
      throw error;
    }
  }
};