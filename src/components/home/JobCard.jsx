import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  MapPin,
  Building2,
  Clock,
  ChevronRight,
  Zap,
  DollarSign,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/utils/timestamp';

export default function JobCard({ job, user }) {
  const [imageError, setImageError] = useState(false);
  const handleApply = async () => {};

  return (
    <>
      <div className="flex-shrink-0">
        {job.company_logo && !imageError ? (
          <img
            src={job.company_logo}
            alt={job.company_name}
            className="rounded-lg w-16 h-16 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex justify-center items-center bg-gray-100 rounded-lg w-16 h-16">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-indigo-600 text-sm">{job.company_name}</p>
          {job.category && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="mr-1 w-3 h-3" />
              {job.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-900 group-hover:text-indigo-700 text-lg transition-colors">
          <h1 className="transition-all group-hover:translate-x-2 ns">{job.title}</h1>
          <div className="flex justify-end w-5 h-5 overflow-hidden">
            <div className="flex w-10 h-5 transition-all group-hover:translate-x-5 duration-300 ease-in-out">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              <div className="w-5 h-5"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-gray-500 text-sm">
          <div className="flex items-center transition-all group-hover:translate-x-1 ease-in-out">
            <MapPin className="mr-1.5 w-4 h-4" />
            <span>
              {job.location} • {job.remote_type}
            </span>
          </div>
          <div className="flex justify-start items-center gap-1 h-4.5 transition-all group-hover:translate-x-1 ease-in-out">
            <Clock className="w-4" />
            <span>{formatTimestamp(job.createdAt || job.created_date, 'relative')}</span>
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
                  : `${job.salary_amount}`}
                k
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" asChild>
            <Link to={`${createPageUrl('JobDetail')}?id=${job.id}`}>View Details</Link>
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Now
          </Button>
        </div>
      </div>
    </>
  );
}
