import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PaymentHistory({ payments }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Records of all your payments on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.created_date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{payment.job_title}</TableCell>
                <TableCell>${payment.amount.toFixed(2)} {payment.currency}</TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">{payment.transaction_id}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No payment history found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}