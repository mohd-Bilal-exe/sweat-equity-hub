import { useNavigate } from 'react-router-dom';


import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import {
  Briefcase,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
  Building2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/api/zustand";
import { use } from "react";
import { firebaseServices } from '@/api/firebase/services';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {user}=useUserStore()
const Navigate=useNavigate()
  useEffect(()=>{
    setUser(user)
    console.log(User)
    if(User){
      setIsLoading(false)
    }else{
      Navigate("/auth")
    }
  })



  const navItems = [
    { name: "Browse Jobs", href: createPageUrl("Home"), icon: Briefcase },
    { name: "Talent Dashboard", href: createPageUrl("TalentDashboard"), icon: Users },
    { name: "Employer Dashboard", href: createPageUrl("EmployerDashboard"), icon: Building2 },
  ];

  return (
    <div className="flex flex-col justify-between bg-white min-h-screen text-gray-800">
      {/* Navigation */}
      <nav className="top-0 z-50 sticky bg-white/40 backdrop-blur-lg border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="flex justify-center items-center rounded-lg w-8 h-8">
                <img src="/logoDark.jpg" className="rounded-xl overflow-hidden"/>
              </div>
              <span className="font-bold text-gray-900 text-xl">sweatquity</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={!user?"/home":item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href 
                      ? "bg-gray-100 text-gray-900"
                      : `text-gray-500 ${user ?"hover:text-gray-900 hover:bg-gray-100 ": "cursor-not-allowed"}`
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {User ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <UserIcon className="mr-2 w-4 h-4" />
                          {user.full_name||user.email}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("Profile")}>
                              <UserIcon className="mr-2 w-4 h-4" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          {User.user_type === "talent" && (
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl("TalentDashboard")}>
                                <Briefcase className="mr-2 w-4 h-4" />
                                My Applications
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {User.user_type === "employer" && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl("EmployerDashboard")}>
                                  <Building2 className="mr-2 w-4 h-4" />
                                  Dashboard
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl("PostJob")}>
                                  <Briefcase className="mr-2 w-4 h-4" />
                                  Post Job
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={firebaseServices.signOutUser}>
                          <LogOut className="mr-2 w-4 h-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                    to="/auth"
                      variant="outline"
                      className="hover:bg-gray-100 px-3 py-2 border rounded-lg font-medium text-gray-800 hover:text-gray-900 text-sm transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden hover:bg-gray-100 p-2 rounded-lg text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-white">
        <div className="flex flex-col justify-between mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex md:flex-row flex-col justify-between items-center mb-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex justify-center items-center bg-white rounded-lg w-8 h-8">
                <img src="/logoDark.jpg" className="rounded-xl overflow-hidden"/>
              </div>
              <span className="font-bold text-xl">sweatquity</span>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-0">
                <Link to={createPageUrl("About")} className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
                <Link to={createPageUrl("Pricing")} className="text-gray-400 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </a>
            </div>
          </div>
          
          <div className="mt- pt-6 border-gray-800 border-t text-center">
            <p className="text-gray-400 text-sm">
              © 2025 sweatquity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

