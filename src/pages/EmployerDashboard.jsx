import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Job } from "@/api/entities";
import { Payment } from "@/api/entities";
import { Application } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import JobList from "../components/employer/JobList";
import PaymentHistory from "../components/employer/PaymentHistory";
import EmployerDashboardStats from "../components/employer/DashboardStats";

export default function EmployerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const [userJobs, userPayments, userApplications] = await Promise.all([
        Job.filter({ created_by: currentUser.email }, "-created_date"),
        Payment.filter({ employer_id: currentUser.id }, "-created_date"),
        Application.filter({ employer_id: currentUser.id }, "-created_date"),
      ]);
      setJobs(userJobs);
      setPayments(userPayments);
      setApplications(userApplications);
    } catch (error) {
      console.error("User not signed in, showing demo data");
      // Show demo data when not signed in
      setUser(null);
      setJobs([
      ]);
      setApplications([
        
      ]);
      setPayments([
        {
          id: "pay1",
          job_title: "Senior React Developer",
          amount: 20,
          currency: "USD",
          status: "completed",
          transaction_id: "txn_demo123",
          created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }
    setIsLoading(false);
  };
  
  const deleteJob = async (jobId) => {
    if (!user) {
      alert("Sign in to manage jobs");
      return;
    }
    if(confirm('Are you sure you want to delete this job posting?')){
      try {
        await Job.delete(jobId);
        fetchData();
      } catch(e) {
        alert('Failed to delete job.');
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-bold text-gray-900 text-3xl">Employer Dashboard</h1>
            <p className="text-gray-600">
              {user ? "Manage your job postings and view payments." : "Demo view - Sign in to manage your actual job postings."}
            </p>
          </div>
          <Button asChild>
            <Link to={createPageUrl('PostJob')}>
              <Plus className="mr-2 w-4 h-4"/>
              Post New Job
            </Link>
          </Button>
        </div>
        
        <EmployerDashboardStats jobs={jobs} applications={applications} />

        <Tabs defaultValue="jobs">
          <TabsList className="mb-4">
            <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <JobList jobs={jobs} deleteJob={deleteJob} />
            {!user && (
              <Card className="bg-blue-50 mt-6 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 font-semibold text-blue-900 text-lg">This is a Demo View</h3>
                  <p className="mb-4 text-blue-700">Sign in to post and manage your actual job listings.</p>
                  <Button asChild>
                    <Link to={createPageUrl("Home")}>Sign In to Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="payments">
            <PaymentHistory payments={payments} />
            {!user && (
              <Card className="bg-blue-50 mt-6 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 font-semibold text-blue-900 text-lg">This is a Demo View</h3>
                  <p className="mb-4 text-blue-700">Sign in to view your actual payment history.</p>
                  <Button asChild>
                    <Link to={createPageUrl("Home")}>Sign In to Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}