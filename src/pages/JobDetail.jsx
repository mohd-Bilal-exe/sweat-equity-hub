
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Job } from "@/api/entities";
import { User } from "@/api/entities";
import { Application } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function JobDetail() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");
  const [showApplication, setShowApplication] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      checkAuth();
    }
  }, [jobId]);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser && jobId) {
        checkApplicationStatus(currentUser.id);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const loadJobDetails = async () => {
    try {
      const jobs = await Job.filter({ id: jobId });
      if (jobs.length > 0) {
        setJob(jobs[0]);
      }
    } catch (error) {
      console.error("Error loading job details:", error);
    }
    setIsLoading(false);
  };

  const checkApplicationStatus = async (userId) => {
    try {
      const applications = await Application.filter({ job_id: jobId, applicant_id: userId });
      setHasApplied(applications.length > 0);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    if (user.user_type !== "talent") {
      setError("Only talent users can apply for jobs. Please update your profile.");
      return;
    }

    setIsApplying(true);
    setError(null);

    try {
      // Create the application
      await Application.create({
        job_id: jobId,
        job_title: job.title,
        company_name: job.company_name,
        applicant_id: user.id,
        applicant_name: user.full_name,
        applicant_email: user.email,
        applicant_cv_url: user.cv_url,
        applicant_linkedin: user.linkedin_url,
        applicant_skills: user.skills || [],
        cover_message: coverMessage,
        employer_id: job.created_by
      });

      // Send email notification to employer
      try {
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
    }
    setIsApplying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => window.location.href = createPageUrl("Home")}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    engineering: "bg-blue-100 text-blue-800 border-blue-200",
    design: "bg-purple-100 text-purple-800 border-purple-200",
    marketing: "bg-pink-100 text-pink-800 border-pink-200",
    sales: "bg-green-100 text-green-800 border-green-200",
    product: "bg-orange-100 text-orange-800 border-orange-200",
    operations: "bg-cyan-100 text-cyan-800 border-cyan-200",
    finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
    legal: "bg-red-100 text-red-800 border-red-200",
    hr: "bg-indigo-100 text-indigo-800 border-indigo-200",
    other: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={() => window.location.href = createPageUrl("Home")}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="bg-white border rounded-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex items-start space-x-4 mb-4 lg:mb-0">
              {job.company_logo ? (
                <img 
                  src={job.company_logo} 
                  alt={job.company_name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-lg text-gray-700 font-medium">{job.company_name}</h2>
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
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Posted {format(new Date(job.created_date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-t pt-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{job.location} • {job.remote_type}</span>
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

          <div className="flex flex-col sm:flex-row gap-4">
            {hasApplied ? (
              <div className="flex items-center space-x-2 text-green-600 font-medium bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <Button 
                onClick={() => setShowApplication(true)}
                size="lg"
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {job.requirements && (
          <div className="bg-white border rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {job.requirements}
            </div>
          </div>
        )}

        {showApplication && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for {job.title}</h3>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Cover Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Tell the company why you're interested in this role..."
                    value={coverMessage}
                    onChange={(e) => setCoverMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleApply}
                    disabled={isApplying}
                    className="flex-1"
                  >
                    {isApplying ? "Submitting..." : "Submit Application"}
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
