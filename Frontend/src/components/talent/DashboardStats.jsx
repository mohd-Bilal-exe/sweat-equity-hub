import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Handshake, Award } from "lucide-react";

export default function TalentDashboardStats({ applications }) {
  const stats = {
    submitted: applications.length,
    viewed: applications.filter(app => app.status === 'viewed').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
  };

  const statItems = [
    { title: "Total Applications", value: stats.submitted, icon: FileText, color: "text-gray-600" },
    { title: "Under Review", value: stats.viewed, icon: Eye, color: "text-blue-600" },
    { title: "Interviews", value: stats.interview, icon: Handshake, color: "text-yellow-600" },
    { title: "Offers", value: stats.offer, icon: Award, color: "text-green-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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