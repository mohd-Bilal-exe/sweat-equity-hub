import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Application } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, Eye, XCircle, Handshake, Award } from "lucide-react";
import TalentDashboardStats from "../components/talent/DashboardStats";

export default function TalentDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const userApplications = await Application.filter({ applicant_id: currentUser.id }, "-created_date");
        setApplications(userApplications);
      } catch (error) {
        console.error("User not signed in, showing demo data");
        // Show demo data when not signed in
        setUser(null);
        setApplications([
          {
            id: "demo1",
            job_title: "Senior Frontend Engineer",
            company_name: "Innovate Inc.",
            job_id: "job1",
            status: "interview",
            created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "demo2", 
            job_title: "Lead Product Designer",
            company_name: "Creative Labs",
            job_id: "job2",
            status: "viewed",
            created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "demo3",
            job_title: "Growth Marketing Manager", 
            company_name: "ScaleUp",
            job_id: "job3",
            status: "submitted",
            created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const statusMap = {
    submitted: { text: "Submitted", icon: FileText, color: "bg-gray-100 text-gray-800" },
    viewed: { text: "Viewed", icon: Eye, color: "bg-blue-100 text-blue-800" },
    rejected: { text: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800" },
    interview: { text: "Interview", icon: Handshake, color: "bg-yellow-100 text-yellow-800" },
    offer: { text: "Offer", icon: Award, color: "bg-green-100 text-green-800" },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Talent Dashboard</h1>
          <p className="text-gray-600">
            {user ? "Track the status of all your job applications." : "Demo view - Sign in to see your actual applications."}
          </p>
        </div>
        
        <TalentDashboardStats applications={applications} />
        
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>
              {applications.length} application{applications.length !== 1 ? 's' : ''} {user ? 'submitted' : '(demo data)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => {
                    const statusInfo = statusMap[app.status] || statusMap.submitted;
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.job_title}</TableCell>
                        <TableCell>{app.company_name}</TableCell>
                        <TableCell>{format(new Date(app.created_date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            <statusInfo.icon className="w-3 h-3 mr-1.5" />
                            {statusInfo.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link to={createPageUrl("JobDetail", `id=${app.job_id}`)}>View Job</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      You haven't applied to any jobs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {!user && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">This is a Demo View</h3>
              <p className="text-blue-700 mb-4">Sign in to see your actual job applications and track their progress.</p>
              <Button asChild>
                <Link to={createPageUrl("Home")}>Sign In to Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}