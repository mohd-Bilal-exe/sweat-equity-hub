import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { firebaseServices } from '@/api/firebase/services';
import { analytics } from '@/api/firebase/analytics';
import useUserStore from '@/api/zustand';
import SEO from '@/components/SEO';
import {
  MapPin,
  Building2,
  Zap,
  Users,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatTimestamp } from '@/utils/timestamp';
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
      checkApplicationStatus();
      // Track page view for analytics
      analytics.trackPageView(`Job Detail - ${jobId}`);
    }
  }, [jobId, user]);

  const loadJobDetails = async () => {
    try {
      const jobData = await firebaseServices.getJob(jobId);
      if (jobData) {
        setJob(jobData);
        analytics.trackJobView(jobId, jobData.title);
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    }
    setIsLoading(false);
  };

  const checkApplicationStatus = useCallback(async () => {
    try {
      if (!user?.applications || user.applications.length === 0) {
        setHasApplied(false);
        return;
      }

      // More efficient: check applications one by one until we find a match
      for (const appRef of user.applications) {
        try {
          const app = await firebaseServices.getDocument(appRef);
          if (app?.job_id === jobId) {
            setHasApplied(true);
            return;
          }
        } catch (error) {
          console.error('Error checking individual application:', error);
          continue;
        }
      }
      setHasApplied(false);
    } catch (error) {
      console.error('Error checking application status:', error);
      setHasApplied(false);
    }
  }, [user?.applications, jobId]);

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
      // Track application analytics
      analytics.trackJobApplication(jobId, job.title);

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

      // Send email notification using EmailJS (free service)
      try {
        const emailjs = (await import('emailjs-com')).default;

        const skillsList =
          user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'Not specified';

        await emailjs.send(
          'service_1rtl8ei', // EmailJS service ID
          'template_xq5dxnl', // EmailJS template ID
          {
            to_email: job.company_email || 'employer@company.com', // Employer email
            job_title: job.title,
            company_name: job.company_name,
            applicant_name: user.full_name,
            applicant_email: user.email,
            applicant_skills: skillsList,
            linkedin_url: user.linkedin_url || 'Not provided',
            cv_url: user.cv_url || 'Not provided',
            cover_message: coverMessage || 'No cover message provided',
            dashboard_url: `${window.location.origin}${createPageUrl('EmployerDashboard')}`,
          },
          'kIHQ_Mqe8gU9Uvzt8' // EmailJS public key
        );
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the application if email fails
      }

      setHasApplied(true);
      setShowApplication(false);
      setCoverMessage('');
    } catch (error) {
      console.error('Error applying for job:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
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
    <>
      {job && (
        <SEO
          title={`${job.title} at ${job.company_name}`}
          description={`${job.title} position at ${job.company_name}. ${
            job.equity_percentage ? `${job.equity_percentage}% equity` : ''
          } ${job.salary_amount ? `$${job.salary_amount}k salary` : ''}. ${job.location} • ${
            job.remote_type
          }`}
          keywords={`${job.title}, ${job.company_name}, ${job.category}, startup job, equity, ${job.location}`}
        />
      )}
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
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-bold text-gray-900 text-2xl lg:text-3xl">{job.title}</h1>
                    {job.category && (
                      <Badge
                        variant="secondary"
                        className={`text-sm capitalize ${
                          categoryColors[job.category] || categoryColors.other
                        }`}
                      >
                        <Tag className="mr-1 w-3 h-3" />
                        {job.category}
                      </Badge>
                    )}
                  </div>
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
                    Posted {formatTimestamp(job.createdAt || job.created_date, 'medium')}
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
              {job.equity_percentage && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Zap className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-600">
                    {job.equity_percentage}% Equity
                  </span>
                </div>
              )}
              {job.salary_amount && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-600">${job.salary_amount}k Salary</span>
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
                <Button
                  onClick={() => setShowApplication(true)}
                  size="lg"
                  disabled={isApplying || !user || user.user_type !== 'talent'}
                >
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
    </>
  );
}
