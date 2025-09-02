import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Job } from "@/api/entities";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";

export default function PostJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const isEditing = !!jobId;
  
  const [user, setUser] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    remote_type: "onsite",
    equity_percentage: "",
    salary_amount: ""
  });
  const [showEquity, setShowEquity] = useState(true);
  const [showSalary, setShowSalary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (!currentUser.company_name) {
          setError("Please complete your company profile before posting a job.");
        }
        
        if (isEditing) {
          await loadJob();
        }
      } catch (e) {
        navigate(createPageUrl("Home"));
      }
    };
    fetchUser();
  }, []);

  const loadJob = async () => {
    try {
      const jobs = await Job.filter({ id: jobId });
      if (jobs.length > 0) {
        const job = jobs[0];
        setJobDetails({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements || "",
          location: job.location || "",
          remote_type: job.remote_type || "onsite",
          equity_percentage: job.equity_percentage || "",
          salary_amount: job.salary_amount || ""
        });
        
        setShowEquity(!!job.equity_percentage);
        setShowSalary(!!job.salary_amount);
      }
    } catch (error) {
      console.error("Error loading job:", error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setJobDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === "" ? "" : parseFloat(value);
    setJobDetails((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.company_name) {
      setError("Please complete your company profile before posting a job.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const newJob = {
        ...jobDetails,
        equity_percentage: showEquity ? jobDetails.equity_percentage : null,
        salary_amount: showSalary ? jobDetails.salary_amount : null,
        company_id: user.id,
        company_name: user.company_name,
        company_logo: user.company_logo,
      };
      
      if (isEditing) {
        await Job.update(jobId, newJob);
      } else {
        await Job.create(newJob);
      }
      
      navigate(createPageUrl("EmployerDashboard"));
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'post'} job. Please check your details and try again.`);
      console.error(err);
    }
    setIsSaving(false);
  };
  
  const remoteTypes = [
    { value: "onsite", label: "On-site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" }
  ];

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Job' : 'Post a New Job'}</CardTitle>
              <CardDescription>
                Fill in the details below to find your next great hire.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                      {error} {error.includes("profile") && <Link to={createPageUrl('Profile')} className="font-bold underline">Go to Profile</Link>}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" value={jobDetails.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., San Francisco, CA" value={jobDetails.location} onChange={handleInputChange} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" value={jobDetails.description} onChange={handleInputChange} rows={6} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" value={jobDetails.requirements} onChange={handleInputChange} rows={6} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remote_type">Work Type</Label>
                <Select onValueChange={(v) => handleSelectChange("remote_type", v)} value={jobDetails.remote_type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {remoteTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Equity Percentage */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-equity"
                    checked={showEquity}
                    onCheckedChange={setShowEquity}
                  />
                  <Label htmlFor="show-equity">Include Equity Details</Label>
                </div>
                
                {showEquity && (
                  <div className="space-y-2">
                    <Label htmlFor="equity_percentage">
                      Equity Percentage (%)
                    </Label>
                    <Input
                      id="equity_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="e.g., 1.5"
                      value={jobDetails.equity_percentage}
                      onChange={(e) => handleNumberChange("equity_percentage", e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              {/* Salary Amount */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-salary"
                    checked={showSalary}
                    onCheckedChange={setShowSalary}
                  />
                  <Label htmlFor="show-salary">Include Salary Range</Label>
                </div>
                
                {showSalary && (
                  <div className="space-y-2">
                    <Label htmlFor="salary_amount">
                      Salary Amount (in thousands, e.g., 150 for $150k)
                    </Label>
                    <Input
                      id="salary_amount"
                      type="number"
                      min="0"
                      placeholder="e.g., 150"
                      value={jobDetails.salary_amount}
                      onChange={(e) => handleNumberChange("salary_amount", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={isSaving || !!error}>
                {isSaving ? (isEditing ? 'Updating Job...' : 'Posting Job...') : (isEditing ? 'Update Job' : 'Post Job')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}