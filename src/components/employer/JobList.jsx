import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Edit, Trash2, Loader } from 'lucide-react';
import { formatTimestamp } from '@/utils/timestamp';

export default function JobList({ jobs, deleteJob, isDeleting }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Job Postings</CardTitle>
        <CardDescription>{jobs.length} jobs posted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div
              key={job.id}
              className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-xl">{job.title}</h3>
                {job.hasEdited ? (
                  <p className="text-gray-500 text-xs"> Edited {formatTimestamp(job.editedAt)}</p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    Posted {formatTimestamp(job.created_date)}
                  </p>
                )}

                <Badge variant={job.is_active ? 'default' : 'secondary'} className="mt-2">
                  {job.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={createPageUrl('ManageJob', job.id)}>
                    <Users className="mr-2 w-4 h-4" />
                    View Applicants
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to={createPageUrl(`PostJob`, job.id)}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                  {isDeleting ? (
                    <Loader className="w-4 h-4 text-red-500 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-500" />
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-gray-500 text-center">You have not posted any jobs yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
