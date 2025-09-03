import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Job } from '@/api/entities';
import { User } from '@/api/entities';
import { Application } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { firebaseServices } from '@/api/firebase/services';
import useUserStore from '@/api/zustand';
import {
  MapPin,
  Building2,
  Clock,
  Zap,
  Users,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';

export default function JobDetail() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('id');
  const [job, setJob] = useState(null);
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverMessage, setCoverMessage] = useState('');
  const [showApplication, setShowApplication] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      if (user) {
        checkApplicationStatus();
      }
    }
  }, [jobId, user]);

  const loadJobDetails = async () => {
    try {
      const jobData = await firebaseServices.getJob(jobId);
      if (jobData) {
        setJob(jobData);
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    }
    setIsLoading(false);
  };

  const checkApplicationStatus = async () => {
    try {
      if (!user?.applications) {
        setHasApplied(false);
        return;
      }
      // Check if user has already applied to this job
      const userApplications = await Promise.all(
        user.applications.map(ref => firebaseServices.getDocument(ref))
      );
      const hasAppliedToJob = userApplications.some(app => app?.job_id === jobId);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    if (user.user_type !== 'talent') {
      setError('Only talent users can apply for jobs. Please update your profile.');
      return;
    }

    setIsApplying(true);
    setError(null);

    try {
      // Create the application with document references
      await firebaseServices.addJobApplication({
        job_id: jobId,
        job_title: job.title,
        company_name: job.company_name,
        applicant_id: user.uid,
        applicant_name: user.full_name,
        applicant_email: user.email,
        applicant_cv_url: user.cv_url,
        applicant_linkedin: user.linkedin_url,
        applicant_skills: user.skills || [],
        cover_message: coverMessage,
        employer_id: job.company_id,
        status: 'submitted',
        created_date: new Date().toISOString(),
      });
    } catch {
    } finally {
      setIsApplying(false);
    }
    // Send email notification to employer
    /*try {
        const skillsList = user.skills && user.skills.length > 0 ? user.skills.join(", ") : "Not specified";
        const emailBody = `
New Application Received!

Job: ${job.title}
Company: ${job.company_name}

Applicant Details:
Name: ${user.full_name}
Email: ${user.email}
Skills: ${skillsList}
LinkedIn: ${user.linkedin_url || "Not provided"}
CV: ${user.cv_url || "Not provided"}

${coverMessage ? `Cover Message: ${coverMessage}` : ''}

You can view and manage all applications in your employer dashboard at ${window.location.origin}${createPageUrl("EmployerDashboard")}

Best regards,
The sweatquity Team
        `;

        await SendEmail({
          to: job.created_by, // Assuming job.created_by is the employer's ID or email
          subject: `New Application: ${job.title} - ${user.full_name}`,
          body: emailBody,
          from_name: "sweatquity"
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the application if email fails
      }

      setHasApplied(true);
      setShowApplication(false);
      setCoverMessage("");
    } catch (error) {
      console.error("Error applying for job:", error);
      setError("Failed to submit application. Please try again.");
    }*/
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 border rounded-lg text-center">
          <div className="mx-auto border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 border rounded-lg text-center">
          <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
          <h2 className="mb-2 font-bold text-gray-800 text-xl">Job Not Found</h2>
          <p className="mb-4 text-gray-500">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => (window.location.href = createPageUrl('Home'))} variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    engineering: 'bg-blue-100 text-blue-800 border-blue-200',
    design: 'bg-purple-100 text-purple-800 border-purple-200',
    marketing: 'bg-pink-100 text-pink-800 border-pink-200',
    sales: 'bg-green-100 text-green-800 border-green-200',
    product: 'bg-orange-100 text-orange-800 border-orange-200',
    operations: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    finance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    legal: 'bg-red-100 text-red-800 border-red-200',
    hr: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <Button
          onClick={() => (window.location.href = createPageUrl('Home'))}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Jobs
        </Button>

        <div className="bg-white mb-8 p-8 border rounded-lg">
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-start mb-6">
            <div className="flex items-start space-x-4 mb-4 lg:mb-0">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  className="rounded-lg w-16 h-16 object-cover"
                />
              ) : (
                <div className="flex justify-center items-center bg-gray-100 rounded-lg w-16 h-16">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="mb-1 font-bold text-gray-900 text-2xl lg:text-3xl">{job.title}</h1>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="font-medium text-gray-700 text-lg">{job.company_name}</h2>
                  {job.company_website && (
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="mr-1.5 w-4 h-4" />
                  Posted {format(new Date(job.created_date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6 pt-6 border-t">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>
                {job.location} • {job.remote_type}
              </span>
            </div>
            {job.equity_details && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Zap className="w-5 h-5 text-gray-400" />
                <span>{job.equity_details}</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5 text-gray-400" />
                <span>{job.salary_range}</span>
              </div>
            )}
          </div>

          <div className="flex sm:flex-row flex-col gap-4">
            {hasApplied ? (
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 border border-green-200 rounded-lg font-medium text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <Button onClick={() => setShowApplication(true)} size="lg" disabled={isApplying}>
                {isApplying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white mb-8 p-8 border rounded-lg">
          <h3 className="mb-4 font-bold text-gray-900 text-xl">Job Description</h3>
          <div className="max-w-none text-gray-700 leading-relaxed whitespace-pre-line prose prose-gray">
            {job.description}
          </div>
        </div>

        {job.requirements && (
          <div className="bg-white p-8 border rounded-lg">
            <h3 className="mb-4 font-bold text-gray-900 text-xl">Requirements</h3>
            <div className="max-w-none text-gray-700 leading-relaxed whitespace-pre-line prose prose-gray">
              {job.requirements}
            </div>
          </div>
        )}

        {showApplication && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
              <h3 className="mb-4 font-bold text-gray-900 text-xl">Apply for {job.title}</h3>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Cover Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Tell the company why you're interested in this role..."
                    value={coverMessage}
                    onChange={e => setCoverMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleApply} disabled={isApplying} className="flex-1">
                    {isApplying ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button
                    onClick={() => setShowApplication(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
