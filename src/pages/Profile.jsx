import React, { useState, useEffect } from 'react';
import TalentProfileForm from '../components/profile/TalentProfileForm';
import EmployerProfileForm from '../components/profile/EmployerProfileForm';
import { Button } from '@/components/ui/button';
import useUserStore from '@/api/zustand';
import { firebaseServices } from '@/api/firebase/services';

export default function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      setUserType(user.user_type);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleTypeSelection = async type => {
    if (user && !user.user_type) {
      await firebaseServices.updateUser(user.uid, { user_type: type });
      setUserType(type);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 py-20 text-center">
        <h1 className="font-bold text-2xl">Please log in</h1>
        <p className="text-gray-600">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="bg-white shadow-lg p-8 rounded-lg text-center">
          <h1 className="mb-4 font-bold text-2xl">Welcome to sweatquity!</h1>
          <p className="mb-6 text-gray-600">First, let us know who you are.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => handleTypeSelection('talent')} size="lg">
              I'm Talent
            </Button>
            <Button onClick={() => handleTypeSelection('employer')} size="lg" variant="outline">
              I'm an Employer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl">
        {userType === 'talent' && <TalentProfileForm user={user} />}
        {userType === 'employer' && <EmployerProfileForm user={user} />}
      </div>
    </div>
  );
}
