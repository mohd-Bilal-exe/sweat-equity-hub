import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users } from 'lucide-react';
import { formatTimestamp, getDaysUntilExpiry } from '@/utils/timestamp';

export default function SubscriptionBanner({ subscription, onSubscribe }) {
  if (subscription.isActive) {
    const daysLeft = getDaysUntilExpiry(subscription.expiresAt);
    const isExpiringSoon = daysLeft <= 7;

    return (
      <Card
        className={`mb-6 ${
          isExpiringSoon ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Crown
                className={`w-5 h-5 ${isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}
              />
              <div>
                <h3
                  className={`font-semibold ${
                    isExpiringSoon ? 'text-yellow-900' : 'text-green-900'
                  }`}
                >
                  Premium Subscription Active
                </h3>
                <p className={`text-sm ${isExpiringSoon ? 'text-yellow-700' : 'text-green-700'}`}>
                  Unlimited access to all job applications
                </p>
              </div>
            </div>
            <div className="text-sm text-right">
              <p className={`font-medium ${isExpiringSoon ? 'text-yellow-900' : 'text-green-900'}`}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
              </p>
              {daysLeft > 0 && (
                <p className={`${isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}>
                  Expires: {formatTimestamp(subscription.expiresAt, 'medium')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 mb-6 border-blue-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Users className="mt-1 w-6 h-6 text-blue-600" />
            <div>
              <h3 className="mb-2 font-semibold text-blue-900">Upgrade to Premium - $20/month</h3>
              <p className="mb-3 text-blue-700 text-sm">
                You're currently limited to viewing 3 applications per job. Upgrade to see all
                applications and find the perfect candidates.
              </p>
              <ul className="space-y-1 text-blue-600 text-sm">
                <li>• Unlimited application views</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
          <Button onClick={onSubscribe} className="ml-4">
            <Crown className="mr-2 w-4 h-4" />
            Subscribe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
