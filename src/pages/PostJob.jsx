import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import useUserStore from '@/api/zustand';
import { firebaseServices } from '@/api/firebase/services';
import { Timestamp } from 'firebase/firestore';

export default function PostJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: paramJobId } = useParams();
  const jobId = paramJobId || searchParams.get('id');

  const isEditing = !!jobId;
  const { user, setUser } = useUserStore();
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    requirements: '',
    city: '',
    country: '',
    category: '',
    remote_type: 'onsite',
    equity_percentage: '',
    salary_amount: '',
  });
  const [showEquity, setShowEquity] = useState(true);
  const [showSalary, setShowSalary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const loadJob = useCallback(async () => {
    try {
      console.log('Loading job with ID:', jobId);
      const job = await firebaseServices.getJob(jobId);
      console.log('Job data:', job);
      if (job) {
        setJobDetails({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          city: job.city || job.location || '',
          country: job.country || '',
          category: job.category || '',
          remote_type: job.remote_type || 'onsite',
          equity_percentage: job.equity_percentage || '',
          salary_amount: job.salary_amount || '',
        });

        setShowEquity(!!job.equity_percentage);
        setShowSalary(!!job.salary_amount);
      } else {
        console.log('Job not found for ID:', jobId);
        setError('Job not found.');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      setError('Failed to load job details.');
    }
  }, [jobId]);
  useEffect(() => {
    if (isEditing) {
      loadJob();
    }
  }, [isEditing, loadJob]);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setJobDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setJobDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    setJobDetails(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user.company_name) {
      setError('Please complete your company profile before posting a job.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const jobData = {
        ...jobDetails,
        location: `${jobDetails.city}, ${jobDetails.country}`,
        equity_percentage: showEquity ? jobDetails.equity_percentage : null,
        salary_amount: showSalary ? jobDetails.salary_amount : null,
        company_id: user.uid,
        company_name: user.company_name,
        company_logo: user.company_logo,
        is_active: true,
      };

      if (!isEditing) {
        jobData.createdAt = Timestamp.now();
        jobData.created_date = new Date().toISOString();
      }

      if (isEditing) {
        await firebaseServices.updateJob(jobId, jobData);
      } else {
        await firebaseServices.addJob(jobData);
      }

      navigate(createPageUrl('Employer/Dashboard'));
    } catch (err) {
      setError(
        `Failed to ${isEditing ? 'update' : 'post'} job. Please check your details and try again.`
      );
      console.error(err);
    }

    setIsSaving(false);
  };

  const remoteTypes = [
    { value: 'onsite', label: 'On-site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Netherlands',
    'Sweden',
    'Switzerland',
    'Singapore',
    'Japan',
    'South Korea',
    'India',
    'Brazil',
    'Mexico',
    'Spain',
    'Italy',
    'Poland',
    'Czech Republic',
    'Denmark',
    'Norway',
    'Finland',
    'Austria',
    'Belgium',
    'Ireland',
    'New Zealand',
  ];

  const categories = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'Legal',
    'HR',
    'Customer Success',
    'Data Science',
    'DevOps',
    'Security',
    'QA',
    'Business Development',
    'Content',
    'Other',
  ];

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl">
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
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {error}{' '}
                    {error.includes('profile') && (
                      <Link to={createPageUrl('Profile')} className="font-bold underline">
                        Go to Profile
                      </Link>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={jobDetails.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Job Category</Label>
                  <Select
                    onValueChange={v => handleSelectChange('category', v)}
                    value={jobDetails.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., San Francisco"
                    value={jobDetails.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    onValueChange={v => handleSelectChange('country', v)}
                    value={jobDetails.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={jobDetails.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={jobDetails.requirements}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remote_type">Work Type</Label>
                <Select
                  onValueChange={v => handleSelectChange('remote_type', v)}
                  value={jobDetails.remote_type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {remoteTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Equity Percentage */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-equity" checked={showEquity} onCheckedChange={setShowEquity} />
                  <Label htmlFor="show-equity">Include Equity Details</Label>
                </div>

                {showEquity && (
                  <div className="space-y-2">
                    <Label htmlFor="equity_percentage">Equity Percentage (%)</Label>
                    <Input
                      id="equity_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="e.g., 1.5"
                      value={jobDetails.equity_percentage}
                      onChange={e => handleNumberChange('equity_percentage', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Salary Amount */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-salary" checked={showSalary} onCheckedChange={setShowSalary} />
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
                      onChange={e => handleNumberChange('salary_amount', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isSaving || !!error}>
                {isSaving
                  ? isEditing
                    ? 'Updating Job...'
                    : 'Posting Job...'
                  : isEditing
                  ? 'Update Job'
                  : 'Post Job'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
