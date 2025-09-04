import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Eye, XCircle, Handshake, Award, ArrowUpDown } from 'lucide-react';
import TalentDashboardStats from '../components/talent/DashboardStats';
import useUserStore from '@/api/zustand';
import { firebaseServices } from '@/api/firebase/services';
import { formatTimestamp } from '@/utils/timestamp';

export default function TalentDashboard() {
  const { user } = useUserStore();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      if (!user?.applications) {
        setApplications([]);
        return;
      }

      const userApplications = await Promise.all(
        user.applications.map(ref => (ref ? firebaseServices.getDocument(ref) : null))
      );
      setApplications(userApplications.filter(Boolean));
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const statusMap = {
    submitted: { text: 'Submitted', icon: FileText, color: 'bg-gray-100 text-gray-800' },
    viewed: { text: 'Viewed', icon: Eye, color: 'bg-blue-100 text-blue-800' },
    rejected: { text: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800' },
    interview: { text: 'Interview', icon: Handshake, color: 'bg-yellow-100 text-yellow-800' },
    offer: { text: 'Offer', icon: Award, color: 'bg-green-100 text-green-800' },
  };

  const filteredAndSortedApplications = applications
    .filter(app => {
      const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'created_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? result : -result;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 text-3xl">Talent Dashboard</h1>
          <p className="text-gray-600">
            {user
              ? 'Track the status of all your job applications.'
              : 'Sign in to see your actual applications.'}
          </p>
        </div>

        <TalentDashboardStats applications={applications} />

        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>
              {applications.length} application{applications.length !== 1 ? 's' : ''}{' '}
              {user ? 'submitted' : '(demo data)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('job_title')} className="h-auto p-0 font-semibold">
                      Job Title <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('company_name')} className="h-auto p-0 font-semibold">
                      Company <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('created_date')} className="h-auto p-0 font-semibold">
                      Date Applied <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('status')} className="h-auto p-0 font-semibold">
                      Status <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedApplications.length > 0 ? (
                  filteredAndSortedApplications.map(app => {
                    const statusInfo = statusMap[app.status] || statusMap.submitted;
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.job_title}</TableCell>
                        <TableCell>{app.company_name}</TableCell>
                        <TableCell>{formatTimestamp(app.created_date)}</TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            <statusInfo.icon className="mr-1.5 w-3 h-3" />
                            {statusInfo.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`${createPageUrl('JobDetail')}?id=${app.job_id}`}>
                              View Job
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {applications.length === 0 ? "You haven't applied to any jobs yet." : "No applications match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!user && (
          <Card className="bg-blue-50 mt-8 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="mb-2 font-semibold text-blue-900 text-lg">This is a Demo View</h3>
              <p className="mb-4 text-blue-700">
                Sign in to see your actual job applications and track their progress.
              </p>
              <Button asChild>
                <Link to={createPageUrl('Home')}>Sign In to Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
