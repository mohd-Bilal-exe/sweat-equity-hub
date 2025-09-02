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
            {user ? "Track the status of all your job applications." : "Sign in to see your actual applications."}
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
                            <statusInfo.icon className="mr-1.5 w-3 h-3" />
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      You haven't applied to any jobs yet.
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
              <p className="mb-4 text-blue-700">Sign in to see your actual job applications and track their progress.</p>
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