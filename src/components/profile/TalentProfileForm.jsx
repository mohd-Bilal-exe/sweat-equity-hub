import React, { useState } from 'react';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
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
import { Upload, Linkedin, Github, FileText, Trash2 } from 'lucide-react';
import { firebaseServices } from '@/api/firebase/services';

export default function TalentProfileForm({ user }) {
  const [profile, setProfile] = useState({
    full_name: user.full_name || '',
    location: user.location || '',
    skills: user.skills ? user.skills.join(', ') : '',
    linkedin_url: user.linkedin_url || '',
    github_url: user.github_url || '',
    cv_url: user.cv_url || '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleUploadCV = async () => {
    if (!cvFile) return;
    setIsUploading(true);
    try {
      const fileName = `cvs/${user.uid}/${Date.now()}_${cvFile.name}`;
      const file_url = await firebaseServices.uploadFile(cvFile, fileName);
      setProfile(prev => ({ ...prev, cv_url: file_url }));
    } catch (error) {
      console.error('Error uploading CV:', error);
    }
    setIsUploading(false);
    setCvFile(null);
  };

  React.useEffect(() => {
    if (cvFile) {
      handleUploadCV();
    }
  }, [cvFile]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSave = {
      ...profile,
      skills: profile.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),
    };

    try {
      await firebaseServices.updateUser(user.uid, dataToSave);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Talent Profile</CardTitle>
          <CardDescription>
            This information will be visible to employers when you apply for jobs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name || profile.displayName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={profile.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, Figma (comma-separated)"
              value={profile.skills}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
            <div className="flex items-center">
              <Linkedin className="mr-2 w-5 h-5 text-gray-400" />
              <Input
                id="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={profile.linkedin_url}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">Other Supporting Links</Label>
            <div className="flex items-center">
              <Github className="mr-2 w-5 h-5 text-gray-400" />
              <Input
                id="github_url"
                type="url"
                placeholder="https://github.com/yourusername or portfolio link"
                value={profile.github_url}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cv_upload">CV / Resume</Label>
            {profile.cv_url ? (
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View Uploaded CV
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setProfile(p => ({ ...p, cv_url: '' }))}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="cv_upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('cv_upload').click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload CV'}
                </Button>
                <p className="text-gray-500 text-sm">PDF or DOCX, max 5MB.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
