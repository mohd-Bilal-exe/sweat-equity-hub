import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Lightbulb,
  Sparkles
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Everyone Should Own What They Build
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're revolutionizing how people think about work by connecting talented individuals 
            with startups that offer meaningful equity compensation. Because your contribution 
            deserves more than just a paycheck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={createPageUrl("Home")}>
                Browse Equity Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={createPageUrl("PostJob")}>
                Post Your Job
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem with Traditional Hiring</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The current job market often fails both talent and startups when it comes to equity. 
              Talent that builds immense value rarely shares in the upside, while startups struggle 
              to attract top-tier individuals who are motivated by ownership.
            </p>
          </div>
          
          <Card className="bg-white border shadow-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Our Solution: An Equity-First Job Board</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    sweatquity is the world's first job board exclusively focused on roles with meaningful equity compensation.
                    We believe that every employee should be able to have equity in the companies they work for and share in the upside.
                    By putting equity front and center, we create a transparent marketplace where builders can find opportunities to own a piece of what they create.
                  </p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li>Clear equity ranges displayed on every job post.</li>
                    <li>A community of startups committed to sharing success.</li>
                    <li>Tools for talent to find and filter by ownership stake.</li>
                    <li>Focus on long-term value creation, not just salaries.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Own What You Build?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of talented individuals and innovative startups who believe in shared success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={createPageUrl("Home")}>
                Find Equity Jobs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={createPageUrl("PostJob")}>
                Hire with Equity
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}