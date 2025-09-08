import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Linkedin, Lock, Mail, Phone, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTimestamp } from '@/utils/timestamp';

export default function ApplicantList({ applications, isUnlocked, onStatusUpdate }) {
  const visibleApplicants = isUnlocked ? applications : applications.slice(0, 3);
  const hiddenCount = applications.length - visibleApplicants.length;

  const statusColors = {
    submitted: 'bg-gray-100 text-gray-800',
    viewed: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusOptions = [
    { value: 'submitted', label: 'New Application' },
    { value: 'viewed', label: 'Under Review' },
    { value: 'interview', label: 'Interview Scheduled' },
    { value: 'offer', label: 'Offer Extended' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicants</CardTitle>
        <CardDescription>{applications.length} total applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleApplicants.length > 0 ? (
          visibleApplicants.map(app => (
            <div
              key={app.id}
              className="bg-white hover:shadow-md p-6 border rounded-lg transition-shadow"
            >
              <div className="flex lg:flex-row flex-col justify-between items-start gap-6">
                <div className="flex flex-1 items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{app.applicant_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{app.applicant_name}</h4>
                        <p className="text-gray-600">{app.applicant_email}</p>
                        <p className="mt-1 text-gray-400 text-sm">
                          Applied on {formatTimestamp(app.created_date)}
                        </p>
                      </div>
                      <Badge className={statusColors[app.status]}>
                        {statusOptions.find(opt => opt.value === app.status)?.label || app.status}
                      </Badge>
                    </div>

                    {app.applicant_skills && app.applicant_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.applicant_skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {app.cover_message && (
                      <div className="bg-gray-50 mt-4 p-4 border rounded-md">
                        <p className="mb-2 font-medium text-gray-600 text-sm">Cover Message:</p>
                        <p className="text-gray-700 text-sm">{app.cover_message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-fit">
                  <div className="flex items-center gap-2">
                    {app.applicant_cv_url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={app.applicant_cv_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-2 w-4 h-4" /> CV
                        </a>
                      </Button>
                    )}
                    {app.applicant_linkedin && (
                      <Button asChild variant="outline" size="sm">
                        <a href={app.applicant_linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 w-4 h-4" /> LinkedIn
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `mailto:${app.applicant_email}`)}
                    >
                      <Mail className="mr-2 w-4 h-4" /> Email
                    </Button>
                  </div>

                  <Select value={app.status} onValueChange={value => onStatusUpdate(app.id, value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-gray-500 text-center">No applicants yet.</p>
        )}

        {hiddenCount > 0 && (
          <div className="bg-gray-50 p-8 border-2 border-gray-300 border-dashed rounded-lg text-center">
            <Lock className="mx-auto mb-4 w-8 h-8 text-gray-400" />
            <h4 className="font-semibold text-lg">+{hiddenCount} More Applicants</h4>
            <p className="text-gray-500">Unlock to view all applicants for this job.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
