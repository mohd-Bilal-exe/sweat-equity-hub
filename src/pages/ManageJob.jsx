import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Job } from "@/api/entities";
import { Application } from "@/api/entities";
import { Payment } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicantList from "../components/employer/ApplicantList";
import ApplicationPipeline from "../components/employer/ApplicationPipeline";
import { Lock, CreditCard, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function ManageJob() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const [jobData, appData, paymentData] = await Promise.all([
        Job.filter({ id: jobId }),
        Application.filter({ job_id: jobId }, "-created_date"),
        Payment.filter({ job_id: jobId, employer_id: currentUser.id })
      ]);
      
      if (jobData.length > 0) setJob(jobData[0]);
      setApplications(appData);
      setIsUnlocked(paymentData.length > 0);
      
    } catch (error) {
      console.error("Error fetching job management data:", error);
    }
    setIsLoading(false);
  };
  
  const handleUnlock = async () => {
    setIsProcessingPayment(true);
    try {
        await Payment.create({
            employer_id: user.id,
            job_id: jobId,
            job_title: job.title,
            amount: 20.00,
            currency: "USD",
            payment_method: "Stripe (Simulated)",
            transaction_id: `txn_${Date.now()}`,
            status: "completed"
        });
        setIsUnlocked(true);
    } catch (error) {
        console.error("Payment failed", error);
        alert("Payment failed. Please try again.");
    }
    setIsProcessingPayment(false);
  }

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await Application.update(applicationId, { status: newStatus });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if(!job) {
    return <div className="text-center py-20">Job not found.</div>
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button 
            onClick={() => window.location.href = createPageUrl("EmployerDashboard")}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Applicants</h1>
          <p className="text-gray-600">Job: {job.title} • {applications.length} applications</p>
        </div>
        
        {!isUnlocked && applications.length > 3 && (
            <Alert className="mb-6 border-blue-500 bg-blue-50">
                <Lock className="h-4 w-4 text-blue-700"/>
                <AlertTitle className="text-blue-800">Unlock More Applicants</AlertTitle>
                <AlertDescription className="text-blue-700">
                    You can view the first 3 applicants for free. To unlock all {applications.length} applicants, please complete the payment.
                    <Button onClick={handleUnlock} disabled={isProcessingPayment} className="mt-4">
                        <CreditCard className="w-4 h-4 mr-2"/>
                        {isProcessingPayment ? 'Processing...' : 'Unlock All for $20'}
                    </Button>
                </AlertDescription>
            </Alert>
        )}
        
        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pipeline" className="space-y-4">
            <ApplicationPipeline 
              applications={applications} 
              isUnlocked={isUnlocked}
              onStatusUpdate={updateApplicationStatus}
            />
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <ApplicantList 
              applications={applications} 
              isUnlocked={isUnlocked}
              onStatusUpdate={updateApplicationStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}