import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Edit, Trash2 } from 'lucide-react';

export default function JobList({ jobs, deleteJob }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Job Postings</CardTitle>
        <CardDescription>{jobs.length} jobs posted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {jobs.length > 0 ? jobs.map(job => (
          <div key={job.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500">Posted on {format(new Date(job.created_date), 'MMM d, yyyy')}</p>
              <Badge variant={job.is_active ? "default" : "secondary"} className="mt-2">
                {job.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to={createPageUrl('ManageJob', `id=${job.id}`)}>
                  <Users className="w-4 h-4 mr-2"/>
                  View Applicants
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to={createPageUrl('PostJob', `id=${job.id}`)}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                <Trash2 className="w-4 h-4 text-red-500"/>
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500 py-8">You have not posted any jobs yet.</p>
        )}
      </CardContent>
    </Card>
  );
}