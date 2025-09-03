import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Building2, Clock, ChevronRight, Zap, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job, user }) {
  const handleApply = async () => {};

  return (
    <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 bg-white hover:shadow-lg p-4 sm:p-6 border rounded-xl transition-shadow">
      <div className="flex-shrink-0">
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
      </div>

      <div className="flex-grow">
        <p className="font-medium text-indigo-600 text-sm">{job.company_name}</p>
        <h4 className="font-bold text-gray-900 hover:text-indigo-700 text-lg transition-colors">
          <Link to={`${createPageUrl('JobDetail')}?id=${job.id}`}>{job.title}</Link>
        </h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-gray-500 text-sm">
          <div className="flex items-center">
            <MapPin className="mr-1.5 w-4 h-4" />
            <span>
              {job.location} ({job.remote_type})
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 w-4 h-4" />
            <span>{job.created_date}</span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col flex-shrink-0 items-start sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
        <div className="flex flex-col gap-1 text-sm">
          {job.equity_percentage && (
            <div className="flex items-center font-medium text-green-600">
              <Zap className="mr-1.5 w-4 h-4" />
              <span>{job.equity_percentage}%</span>
            </div>
          )}
          {job.salary_amount && (
            <div className="flex items-center font-medium text-blue-600">
              <DollarSign className="mr-1.5 w-4 h-4" />
              <span>
                {typeof job.salary_amount === 'string' && job.salary_amount.startsWith('$')
                  ? job.salary_amount
                  : `$${job.salary_amount}`}
                k
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" asChild>
            <Link to={`${createPageUrl('JobDetail')}?id=${job.id}`}>
              View Details
            </Link>
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
