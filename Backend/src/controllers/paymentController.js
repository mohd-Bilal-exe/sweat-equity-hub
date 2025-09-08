const stripeService = require('../services/stripe');
const { db, admin } = require('../config/firebase');

class PaymentController {
  async createPaymentIntent(req, res) {
    try {
      const { amount, jobId, userId } = req.body;
      
      if (!amount || !jobId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const paymentIntent = await stripeService.createPaymentIntent(amount, 'usd', {
        jobId,
        userId,
        type: 'job_posting'
      });

      // Store payment record in Firestore
      await db.collection('payments').add({
        paymentIntentId: paymentIntent.id,
        amount,
        jobId,
        userId,
        status: 'pending',
        createdAt: new Date(),
        type: 'job_posting'
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }

  async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;
      
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      // Store payment record
      const paymentData = {
        paymentIntentId,
        amount: paymentIntent.amount / 100,
        userId: paymentIntent.metadata.userId,
        status: paymentIntent.status,
        type: paymentIntent.metadata.type,
        createdAt: new Date()
      };
      
      const paymentRef = await db.collection('payments').add(paymentData);
      
      // If subscription payment is successful, update user subscription
      if (paymentIntent.status === 'succeeded' && paymentIntent.metadata.type === 'monthly_subscription') {
        const now = admin.firestore.Timestamp.now();
        const expiresAt = admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        );
        
        await db.collection('users').doc(paymentIntent.metadata.userId).update({
          subscription: {
            isActive: true,
            plan: 'monthly',
            expiresAt: expiresAt,
            lastPaymentDate: now
          },
          payments: admin.firestore.FieldValue.arrayUnion(paymentRef)
        });
      }

      res.json({ 
        status: paymentIntent.status,
        paymentIntent 
      });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ error: 'Failed to confirm payment' });
    }
  }

  async createSubscription(req, res) {
    try {
      const { userId } = req.body;
      const monthlyPrice = 20.00; // $20.00/month
      
      const paymentIntent = await stripeService.createPaymentIntent(monthlyPrice, 'usd', {
        userId,
        type: 'monthly_subscription'
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }

  async getSubscriptionStatus(req, res) {
    try {
      const { userId } = req.params;
      
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      let subscription = userData?.subscription || {
        isActive: false,
        expiresAt: null,
        plan: null,
        lastPaymentDate: null
      };

      // Security check: validate expiry on server side
      if (subscription.isActive && subscription.expiresAt) {
        const now = admin.firestore.Timestamp.now();
        if (subscription.expiresAt.toMillis() < now.toMillis()) {
          // Subscription expired, update status
          subscription.isActive = false;
          await db.collection('users').doc(userId).update({
            'subscription.isActive': false
          });
        }
      }

      res.json({ subscription });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: 'Failed to fetch subscription status' });
    }
  }

  async getPaymentHistory(req, res) {
    try {
      const { userId } = req.params;
      
      const paymentsSnapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ payments });
    } catch (error) {
      console.error('Payment history error:', error);
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  }
}

module.exports = new PaymentController();