import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import { Payment } from '@/api/entities';
import { firebaseServices } from '@/api/firebase/services';
import useUserStore from '@/api/zustand';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApplicantList from '../components/employer/ApplicantList';
import ApplicationPipeline from '../components/employer/ApplicationPipeline';
import { Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ManageJob() {
  const [searchParams] = useSearchParams();
  const { id: paramJobId } = useParams();
  const jobId = paramJobId || searchParams.get('id');

  const { user } = useUserStore();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (jobId && user) {
      fetchData();
    }
  }, [jobId, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      const jobData = await firebaseServices.getJob(jobId);
      if (jobData) {
        setJob(jobData);
        
        // Fetch applications for this job
        if (jobData.applications && jobData.applications.length > 0) {
          const jobApplications = await Promise.all(
            jobData.applications.map(ref => firebaseServices.getDocument(ref))
          );
          setApplications(jobApplications.filter(Boolean));
        } else {
          setApplications([]);
        }
      }

      // Check if user has paid to unlock all applications
      if (user.payments && user.payments.length > 0) {
        const userPayments = await Promise.all(
          user.payments.map(ref => firebaseServices.getDocument(ref))
        );
        const jobPayment = userPayments.find(payment => 
          payment && payment.job_id === jobId && payment.status === 'completed'
        );
        setIsUnlocked(!!jobPayment);
      } else {
        setIsUnlocked(false);
      }
    } catch (error) {
      console.error('Error fetching job management data:', error);
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
        amount: 20.0,
        currency: 'USD',
        payment_method: 'Stripe (Simulated)',
        transaction_id: `txn_${Date.now()}`,
        status: 'completed',
      });
      setIsUnlocked(true);
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Please try again.');
    }
    setIsProcessingPayment(false);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await firebaseServices.updateJobApplication(applicationId, { status: newStatus });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="py-20 text-center">Job not found.</div>;
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Button
            onClick={() => (window.location.href = createPageUrl('EmployerDashboard'))}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="font-bold text-gray-900 text-3xl">Manage Applicants</h1>
          <p className="text-gray-600">
            Job: {job.title} • {applications.length} applications
          </p>
        </div>

        {!isUnlocked && applications.length > 3 && (
          <Alert className="bg-blue-50 mb-6 border-blue-500">
            <Lock className="w-4 h-4 text-blue-700" />
            <AlertTitle className="text-blue-800">Unlock More Applicants</AlertTitle>
            <AlertDescription className="text-blue-700">
              You can view the first 3 applicants for free. To unlock all {applications.length}{' '}
              applicants, please complete the payment.
              <Button onClick={handleUnlock} disabled={isProcessingPayment} className="mt-4">
                <CreditCard className="mr-2 w-4 h-4" />
                {isProcessingPayment ? 'Processing...' : 'Unlock All for $20'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
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
