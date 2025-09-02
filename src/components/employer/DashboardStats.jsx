import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CalendarClock } from "lucide-react";
import { differenceInDays } from 'date-fns';

export default function EmployerDashboardStats({ jobs, applications }) {
  const activeJobs = jobs.filter(job => job.is_active).length;
  const totalApplications = applications.length;
  const newApplicationsThisWeek = applications.filter(app => 
    differenceInDays(new Date(), new Date(app.created_date)) <= 7
  ).length;

  const statItems = [
    { title: "Active Jobs", value: activeJobs, icon: Briefcase, color: "text-green-600" },
    { title: "Total Applicants", value: totalApplications, icon: Users, color: "text-blue-600" },
    { title: "New This Week", value: newApplicationsThisWeek, icon: CalendarClock, color: "text-indigo-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {statItems.map(item => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}