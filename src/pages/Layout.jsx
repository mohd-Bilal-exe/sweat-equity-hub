

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

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    window.location.href = createPageUrl("Home");
  };

  const handleLogin = async () => {
    await User.loginWithRedirect(window.location.origin + createPageUrl("Home"));
  };

  const navItems = [
    { name: "Browse Jobs", href: createPageUrl("Home"), icon: Briefcase },
    { name: "Talent Dashboard", href: createPageUrl("TalentDashboard"), icon: Users },
    { name: "Employer Dashboard", href: createPageUrl("EmployerDashboard"), icon: Building2 },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Navigation */}
      <nav className="top-0 z-50 sticky bg-white/80 backdrop-blur-lg border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="flex justify-center items-center bg-gray-900 rounded-lg w-8 h-8">
                <img data-filename="layout" data-linenumber="74" data-visual-selector-id="layout74" data-source-location="layout:74:14" data-dynamic-content="false" src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/395488b87_WhatsAppImage2025-07-16at203313_d8522d69.jpg" alt="sweatquity logo" class="w-8 h-8 object-contain"/>
              </div>
              <span className="font-bold text-gray-900 text-xl">sweatquity</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <UserIcon className="mr-2 w-4 h-4" />
                          {user.full_name}
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
                          {user.user_type === "talent" && (
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl("TalentDashboard")}>
                                <Briefcase className="mr-2 w-4 h-4" />
                                My Applications
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {user.user_type === "employer" && (
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
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 w-4 h-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                    >
                      Sign In
                    </Button>
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
                <img data-filename="layout" data-linenumber="74" data-visual-selector-id="layout74" data-source-location="layout:74:14" data-dynamic-content="false" src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/395488b87_WhatsAppImage2025-07-16at203313_d8522d69.jpg" alt="sweatquity logo" class="w-8 h-8 object-contain" className="rounded-xl"/>
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

