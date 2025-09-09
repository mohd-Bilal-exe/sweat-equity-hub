import React from 'react';
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
import { format } from 'date-fns';
import { formatTimestamp } from '@/utils/timestamp';

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
            {payments.length > 0 ? (
              payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{formatTimestamp(payment.created_date)}</TableCell>
                  <TableCell className="font-medium">{payment.job_title}</TableCell>
                  <TableCell>
                    ${payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">{payment.paymentIntentId}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No payment history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
