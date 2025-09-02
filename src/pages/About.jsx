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
    <div className="bg-white min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-bold text-gray-900 text-4xl md:text-6xl">
            Everyone Should Own What They Build
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-gray-600 text-xl">
           We're revolutionising how people think about work by connecting talented individuals to leverage their skills for equity compensation. Because your contribution deserves more than just a paycheck.
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
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
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-gray-900 text-3xl">The Problem with Traditional Hiring</h2>
            <p className="mx-auto max-w-3xl text-gray-600">
              The current job market often fails both talent and startups when it comes to equity. 
              Talent that builds immense value rarely shares in the upside, while startups struggle 
              to attract top-tier individuals who are motivated by ownership.
            </p>
          </div>
          
          <Card className="bg-white shadow-sm border">
            <CardContent className="p-8 md:p-12">
              <div className="flex md:flex-row flex-col items-center gap-8">
                
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900 text-2xl">Our Solution: An Equity-First Job Board</h3>
                  <p className="mb-4 text-gray-700 leading-relaxed">
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
      <section className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-gray-900 text-3xl">Ready to Own What You Build?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            Join thousands of talented individuals and innovative startups who believe in shared success.
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
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