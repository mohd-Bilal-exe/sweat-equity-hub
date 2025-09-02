import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import TalentProfileForm from "../components/profile/TalentProfileForm";
import EmployerProfileForm from "../components/profile/EmployerProfileForm";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setUserType(currentUser.user_type);
      } catch (error) {
        console.error("User not logged in", error);
        // Handle not logged in state, maybe redirect
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);
  
  const handleTypeSelection = async (type) => {
      if(user && !user.user_type) {
          await User.update(user.id, {user_type: type});
          setUserType(type);
      }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-gray-50">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="text-gray-600">You need to be logged in to view your profile.</p>
      </div>
    );
  }
  
  if(!userType){
      return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Welcome to sweatquity!</h1>
                <p className="text-gray-600 mb-6">First, let us know who you are.</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => handleTypeSelection('talent')} size="lg">I'm Talent</Button>
                    <Button onClick={() => handleTypeSelection('employer')} size="lg" variant="outline">I'm an Employer</Button>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {userType === "talent" && <TalentProfileForm user={user} />}
        {userType === "employer" && <EmployerProfileForm user={user} />}
      </div>
    </div>
  );
}