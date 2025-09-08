import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Zap, Building2, TrendingUp } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            First 3 Applicants Free
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Fair Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Post your job and review the first three candidates on us. Like what you see? 
            Unlock all applicants for a simple one-time fee.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="relative border-2 border-indigo-300 shadow-lg overflow-hidden">
            <CardHeader className="text-center p-8 bg-white">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">$20</span>
                <span className="text-gray-500 ml-2">/ job</span>
              </div>
              <CardDescription className="text-gray-600 mt-2">
                One-time payment to unlock all applicants.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 bg-gray-50">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">What's Included:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Post unlimited jobs for free</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">View your first 3 applicants per job, on us</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">One-time payment to unlock all candidates for a job</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Access full candidate profiles and contact info</span>
                  </li>
                   <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">No subscriptions, no hidden fees</span>
                  </li>
                </ul>
              </div>
              
              <Button asChild className="w-full" size="lg">
                <Link to={createPageUrl("PostJob")}>
                  Post Your Job Today
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}