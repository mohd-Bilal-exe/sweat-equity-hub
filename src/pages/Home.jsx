
import React, { useState, useEffect } from "react";
import { Job } from "@/api/entities";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import JobCard from "../components/home/JobCard";
import SearchFilters from "../components/home/SearchFilters";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    remoteTypes: [],
    locations: [],
    salaryRanges: [],
    equityRange: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
    checkAuth();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filters]);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadJobs = async () => {
    try {
      const jobData = await Job.filter({ is_active: true }, "-created_date");
      setJobs(jobData);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
    setIsLoading(false);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(job => filters.categories.includes(job.category));
    }

    if (filters.remoteTypes && filters.remoteTypes.length > 0) {
      filtered = filtered.filter(job => filters.remoteTypes.includes(job.remote_type));
    }

    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter(job => filters.locations.includes(job.location));
    }

    if (filters.salaryRanges && filters.salaryRanges.length > 0) {
      filtered = filtered.filter(job => {
        return filters.salaryRanges.some(range => {
          // Handle "Equity Only" filter
          if (range === "equity") {
            return (job.salary_amount === undefined || job.salary_amount === null || job.salary_amount === 0) &&
                   job.equity_percentage && job.equity_percentage > 0;
          }

          // Handle salary ranges
          if (job.salary_amount === undefined || job.salary_amount === null) return false;
          const salaryValue = job.salary_amount;

          switch (range) {
            case "0-50": return salaryValue < 50;
            case "50-100": return salaryValue >= 50 && salaryValue < 100;
            case "100-150": return salaryValue >= 100 && salaryValue < 150;
            case "150-200": return salaryValue >= 150 && salaryValue < 200;
            case "200+": return salaryValue >= 200;
            default: return true;
          }
        });
      });
    }

    if (filters.equityRange > 0) {
      filtered = filtered.filter(job => {
        if (job.equity_percentage === undefined || job.equity_percentage === null) return false;
        return job.equity_percentage >= filters.equityRange;
      });
    }

    setFilteredJobs(filtered);
  };

  const uniqueLocations = [...new Set(jobs.map(job => job.location))].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream
              <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Startup Job</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with innovative startups offering equity compensation. Your next career move could be your biggest investment.
            </p>

            {/* Search Bar */}
            <div className="bg-white border rounded-xl p-4 max-w-2xl mx-auto shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Jobs Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <SearchFilters
            filters={filters}
            setFilters={setFilters}
            uniqueLocations={uniqueLocations}
          />

          {/* Jobs List */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} Jobs Available
            </h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Updated daily</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white border rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or check back later.</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    categories: [],
                    remoteTypes: [],
                    locations: [],
                    salaryRanges: [],
                    equityRange: 0
                  });
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} user={user} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
