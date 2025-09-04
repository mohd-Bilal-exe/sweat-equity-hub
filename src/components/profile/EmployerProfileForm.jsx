import React, { useState } from 'react';
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
import { Upload, LinkIcon, Trash2 } from 'lucide-react';
import { firebaseServices } from '@/api/firebase/services';
import { useNavigate } from 'react-router-dom';

export default function EmployerProfileForm({ user }) {
  const Navigate = useNavigate();
  const [profile, setProfile] = useState({
    company_name: user.company_name || '',
    company_logo: user.company_logo || '',
    company_website: user.company_website || '',
    company_description: user.company_description || '',
    company_size: user.company_size || '',
    company_industry: user.company_industry || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleInputChange = e => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setIsUploading(true);
    try {
      const fileName = `logos/${user.uid}/${Date.now()}_${logoFile.name}`;
      const file_url = await firebaseServices.uploadFile(logoFile, fileName);
      setProfile(prev => ({ ...prev, company_logo: file_url }));
      await firebaseServices.updateUser(user.uid, { company_logo: file_url });
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
    setIsUploading(false);
    setLogoFile(null);
  };

  React.useEffect(() => {
    if (logoFile) {
      handleUploadLogo();
    }
  }, [logoFile]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSave = {
      ...profile,
      skills: profile.company_industry
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),
    };

    try {
      await firebaseServices.updateUser(user.uid, dataToSave);
      setTimeout(() => {
        Navigate('/employer/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
      setIsSaving(false);
    }

    setIsSaving(false);
  };

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Employer Profile</CardTitle>
          <CardDescription>
            This information will be displayed on your job postings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input id="company_name" value={profile.company_name} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_upload">Company Logo</Label>
            <div className="flex items-center gap-4">
              {profile.company_logo && (
                <div className="relative">
                  <img
                    src={profile.company_logo}
                    alt="Company Logo"
                    className="rounded-lg w-16 h-16 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="-top-2 -right-2 absolute rounded-full w-6 h-6"
                    onClick={() => setProfile(p => ({ ...p, company_logo: '' }))}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <Input
                id="logo_upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo_upload').click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Logo'}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_website">Company Website</Label>
            <div className="flex items-center">
              <LinkIcon className="mr-2 w-5 h-5 text-gray-400" />
              <Input
                id="company_website"
                type="text"
                placeholder="https://yourcompany.com"
                value={profile.company_website}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_industry">Industry</Label>
            <Input
              id="company_industry"
              placeholder="e.g., SaaS, Fintech, Healthtech"
              value={profile.company_industry}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_size">Company Size</Label>
            <Select
              onValueChange={value => handleSelectChange('company_size', value)}
              value={profile.company_size}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map(size => (
                  <SelectItem key={size} value={size}>
                    {size} employees
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_description">Company Description</Label>
            <Textarea
              id="company_description"
              placeholder="Describe your company's mission and culture."
              value={profile.company_description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Company Profile'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
