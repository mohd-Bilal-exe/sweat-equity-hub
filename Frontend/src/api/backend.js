const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const backendAPI = {
  async createSubscription(userId, token) {
    const response = await fetch(`${API_BASE_URL}/payments/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  async confirmPayment(paymentIntentId, token) {
    const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ paymentIntentId })
    });
    return response.json();
  },

  async getSubscriptionStatus(userId, token) {
    const response = await fetch(`${API_BASE_URL}/payments/subscription/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};