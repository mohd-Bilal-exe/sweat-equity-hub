import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Zap, Building2, Crown } from "lucide-react";
import useUserStore from "@/api/zustand";
import { backendAPI } from "@/api/backend";
import { getAuth } from "firebase/auth";
import StripeCheckout from "../components/payment/StripeCheckout";

export default function Pricing() {
  const { user } = useUserStore();
  const [subscription, setSubscription] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const checkSubscription = async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }
    
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const result = await backendAPI.getSubscriptionStatus(user.uid, token);
        setSubscription(result.subscription);
      }
    } catch (error) {
      console.error('Subscription check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = () => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    checkSubscription();
    alert('Subscription activated successfully!');
  };

  const hasActiveSubscription = subscription?.isActive;
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center bg-indigo-100 mb-6 px-4 py-2 rounded-full font-medium text-indigo-800 text-sm">
            <Zap className="mr-2 w-4 h-4" />
            First 3 Applicants Free
          </div>
          <h1 className="mb-6 font-bold text-gray-900 text-4xl md:text-5xl">
            Simple, Fair Pricing
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-gray-600 text-xl">
            Post your job and review the first three candidates on us. Like what you see? 
            Unlock all applicants for a simple one-time fee.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-md">
          <Card className="relative shadow-lg border-2 border-indigo-300 overflow-hidden">
            <CardHeader className="bg-white p-8 text-center">
              <div className="flex justify-center items-center bg-indigo-100 mx-auto mb-4 rounded-full w-16 h-16">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="mt-4">
                <span className="font-bold text-gray-900 text-5xl">$20</span>
                <span className="ml-2 text-gray-500">/ month</span>
              </div>
              <CardDescription className="mt-2 text-gray-600">
                {hasActiveSubscription ? 'Your subscription is active!' : 'Monthly subscription for unlimited access.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gray-50 p-8">
              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-gray-900 text-center">What's Included:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Post unlimited jobs for free</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                    <span className="text-gray-700">View your first 3 applicants per job, on us</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">One-time payment to unlock all candidates for a job</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">Access full candidate profiles and contact info</span>
                  </li>
                   <li className="flex items-start">
                    <Check className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">No subscriptions, no hidden fees</span>
                  </li>
                </ul>
              </div>
              
              {isLoading ? (
                <Button disabled className="w-full" size="lg">
                  Loading...
                </Button>
              ) : hasActiveSubscription ? (
                <Button asChild className="w-full" size="lg">
                  <Link to={createPageUrl("Employer/Dashboard")}>
                    <Crown className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : user ? (
                <Button onClick={handleSubscribe} className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </Button>
              ) : (
                <Button asChild className="w-full" size="lg">
                  <Link to={createPageUrl("Auth")}>
                    Sign In to Subscribe
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      
      {showCheckout && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <StripeCheckout 
            userId={user.uid}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowCheckout(false)}
          />
        </div>
      )}
    </div>
  );
}