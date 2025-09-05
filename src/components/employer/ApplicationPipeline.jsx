import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Linkedin, Lock, Mail, Phone } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTimestamp } from '@/utils/timestamp';

export default function ApplicationPipeline({ applications, isUnlocked, onStatusUpdate }) {
  const stages = [
    { key: 'submitted', title: 'New Applications', color: 'bg-gray-100' },
    { key: 'viewed', title: 'Under Review', color: 'bg-blue-100' },
    { key: 'interview', title: 'Interview', color: 'bg-yellow-100' },
    { key: 'offer', title: 'Offer', color: 'bg-green-100' },
    { key: 'rejected', title: 'Rejected', color: 'bg-red-100' },
  ];

  const visibleApplicants = isUnlocked ? applications : applications.slice(0, 3);
  const hiddenCount = applications.length - visibleApplicants.length;

  const getApplicationsByStatus = status => {
    return visibleApplicants.filter(app => app.status === status);
  };

  const statusOptions = [
    { value: 'submitted', label: 'New' },
    { value: 'viewed', label: 'Under Review' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-5">
        {stages.map(stage => (
          <Card key={stage.key} className={`${stage.color} border-0`}>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">
                {stage.title} ({getApplicationsByStatus(stage.key).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getApplicationsByStatus(stage.key).map(app => (
                <div key={app.id} className="bg-white shadow-sm p-3 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {app.applicant_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{app.applicant_name}</h4>
                      <p className="text-gray-500 text-xs truncate">{app.applicant_email}</p>
                      <p className="text-gray-400 text-xs">{formatTimestamp(app.created_date)}</p>

                      {app.applicant_skills && app.applicant_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {app.applicant_skills.slice(0, 2).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="px-1 py-0 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {app.applicant_skills.length > 2 && (
                            <Badge variant="secondary" className="px-1 py-0 text-xs">
                              +{app.applicant_skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-2">
                        {app.applicant_cv_url && (
                          <Button asChild variant="ghost" size="sm" className="px-1 h-6">
                            <a
                              href={app.applicant_cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {app.applicant_linkedin && (
                          <Button asChild variant="ghost" size="sm" className="px-1 h-6">
                            <a
                              href={app.applicant_linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-1 h-6"
                          onClick={() => (window.location.href = `mailto:${app.applicant_email}`)}
                        >
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>

                      <Select
                        value={app.status}
                        onValueChange={value => onStatusUpdate(app.id, value)}
                      >
                        <SelectTrigger className="mt-2 h-6 text-xs">
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
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {hiddenCount > 0 && (
        <Card className="bg-gray-50 border-2 border-gray-300 border-dashed">
          <CardContent className="p-8 text-center">
            <Lock className="mx-auto mb-4 w-8 h-8 text-gray-400" />
            <h4 className="font-semibold text-lg">+{hiddenCount} More Applicants</h4>
            <p className="text-gray-500">Unlock to view all applicants in your pipeline.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
