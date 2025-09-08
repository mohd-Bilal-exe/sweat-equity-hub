import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import JobCard from '../components/home/JobCard';
import SearchFilters from '../components/home/SearchFilters';
import { firebaseServices } from '@/api/firebase/services';
import { analytics } from '@/api/firebase/analytics';
import useUserStore from '@/api/zustand';
import SEO from '@/components/SEO';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { user } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    remoteTypes: [],
    locations: [],
    salaryRanges: [],
    equityRange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    loadJobs();
    analytics.trackPageView('Home');
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filters]);

  const loadJobs = async () => {
    try {
      const jobData = await firebaseServices.getAllJobs({});
      const activeJobs = jobData.filter(job => job.is_active);
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
    setIsLoading(false);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        job =>
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
          if (range === 'equity') {
            return (
              (job.salary_amount === undefined ||
                job.salary_amount === null ||
                job.salary_amount === 0) &&
              job.equity_percentage &&
              job.equity_percentage > 0
            );
          }

          // Handle salary ranges
          if (job.salary_amount === undefined || job.salary_amount === null) return false;
          const salaryValue = job.salary_amount;

          switch (range) {
            case '0-50':
              return salaryValue < 50;
            case '50-100':
              return salaryValue >= 50 && salaryValue < 100;
            case '100-150':
              return salaryValue >= 100 && salaryValue < 150;
            case '150-200':
              return salaryValue >= 150 && salaryValue < 200;
            case '200+':
              return salaryValue >= 200;
            default:
              return true;
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
    <>
      <SEO
        title="Find Your Dream Startup Job"
        description="Discover equity-based opportunities at innovative startups. Connect with companies offering ownership, not just salary."
        keywords="startup jobs, equity compensation, remote work, tech jobs, startup careers, job board"
      />
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 p-8 md:p-12">
              <h1 className="mb-6 font-bold text-gray-900 text-4xl md:text-6xl">
                Find Your Dream
                <span className="block bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent">
                  Startup Job
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
                Where your skills earn ownership, not just a salary.
              </p>

              {/* Search Bar */}
              <div className="bg-white shadow-sm mx-auto p-4 border rounded-xl max-w-2xl">
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="relative flex-1">
                    <Search className="top-3 left-3 absolute w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search jobs, companies, or skills..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="bg-gray-50 pl-10 border-gray-200"
                    />
                  </div>
                  <Button onClick={() => searchTerm && analytics.trackSearch(searchTerm)}>
                    <Search className="mr-2 w-4 h-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Jobs Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mx-auto max-w-4xl">
            {/* Filters */}
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              uniqueLocations={uniqueLocations}
            />

            {/* Jobs List */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-gray-800 text-2xl">
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
                  <div key={i} className="bg-white p-6 border rounded-lg animate-pulse">
                    <div className="flex gap-6">
                      <div className="bg-gray-200 rounded-lg w-16 h-16"></div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                        <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                        <div className="bg-gray-200 rounded w-2/3 h-3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white p-12 border rounded-lg text-center">
                <div className="flex justify-center items-center bg-gray-100 mx-auto mb-6 rounded-full w-16 h-16">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-800 text-xl">No jobs found</h3>
                <p className="mb-6 text-gray-500">
                  Try adjusting your search criteria or check back later.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      categories: [],
                      remoteTypes: [],
                      locations: [],
                      salaryRanges: [],
                      equityRange: 0,
                    });
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {filteredJobs.map(job => (
                    <Link
                      key={job.id}
                      to={`${createPageUrl('JobDetail')}?id=${job.id}`}
                      className="group flex sm:flex-row flex-col items-start sm:items-center gap-6 bg-white hover:shadow-lg p-4 sm:p-6 border rounded-xl transition-shadow"
                    >
                      <JobCard key={job.id} job={job} user={user} />
                    </Link>
                  ))}
                </div>
                <div className="flex justify-center space-x-2 mt-10">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
