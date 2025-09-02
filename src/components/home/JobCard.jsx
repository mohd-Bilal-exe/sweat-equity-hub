
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { 
  MapPin, 
  Building2, 
  Clock, 
  ChevronRight,
  Zap,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function JobCard({ job, user }) {
  const handleApply = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.origin + createPageUrl("JobDetail", `id=${job.id}`));
    } else {
      window.location.href = createPageUrl("JobDetail", `id=${job.id}`);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="flex-shrink-0">
        {job.company_logo ? (
          <img 
            src={job.company_logo} 
            alt={job.company_name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <p className="text-sm font-medium text-indigo-600">{job.company_name}</p>
        <h4 className="text-lg font-bold text-gray-900 hover:text-indigo-700 transition-colors">
          <Link to={createPageUrl("JobDetail", `id=${job.id}`)}>
            {job.title}
          </Link>
        </h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{job.location} ({job.remote_type})</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{formatDistanceToNow(new Date(job.created_date), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
        <div className="flex flex-col gap-1 text-sm">
          {job.equity_percentage && (
            <div className="flex items-center font-medium text-green-600">
              <Zap className="w-4 h-4 mr-1.5" />
              <span>{job.equity_percentage}%</span>
            </div>
          )}
          {job.salary_amount && (
            <div className="flex items-center font-medium text-blue-600">
              <DollarSign className="w-4 h-4 mr-1.5" />
              <span>
                {typeof job.salary_amount === 'string' && job.salary_amount.startsWith('$') 
                  ? job.salary_amount 
                  : `$${job.salary_amount}`
                }k
              </span>
            </div>
          )}
        </div>
        <Button 
          className="w-full sm:w-auto"
          onClick={handleApply}
        >
          {user ? "View Details" : "Apply Now"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
