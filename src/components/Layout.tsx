import { ReactNode, useState, useEffect, useRef } from "react";
import { Heart, Bell, Search, Settings, User, LogOut, Shield, Mail, Phone, X } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { VoiceAssistantButton } from "@/components/VoiceAssistantButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
        fetch(`${API_BASE}/patients`).catch(() => ({ json: () => [] })),
        fetch(`${API_BASE}/doctors`).catch(() => ({ json: () => [] })),
        fetch(`${API_BASE}/departments`).catch(() => ({ json: () => [] }))
      ]);

      const [patients, doctors, departments] = await Promise.all([
        patientsRes.json?.() || [],
        doctorsRes.json?.() || [],
        departmentsRes.json?.() || []
      ]);

      const results: any[] = [];
      const lowerQuery = query.toLowerCase();

      // Search patients
      if (Array.isArray(patients)) {
        patients.forEach((patient: any) => {
          if (
            patient.name?.toLowerCase().includes(lowerQuery) ||
            patient.phone?.includes(query) ||
            patient.department?.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              type: 'patient',
              id: patient._id,
              title: patient.name,
              subtitle: `${patient.age} yrs, ${patient.gender} - ${patient.department}`,
              phone: patient.phone
            });
          }
        });
      }

      // Search doctors
      if (Array.isArray(doctors)) {
        doctors.forEach((doctor: any) => {
          if (
            doctor.name?.toLowerCase().includes(lowerQuery) ||
            doctor.specialization?.toLowerCase().includes(lowerQuery) ||
            doctor.department?.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              type: 'doctor',
              id: doctor._id,
              title: doctor.name,
              subtitle: `${doctor.specialization} - ${doctor.department}`,
              phone: doctor.phone
            });
          }
        });
      }

      // Search departments
      if (Array.isArray(departments)) {
        departments.forEach((dept: any) => {
          if (
            dept.name?.toLowerCase().includes(lowerQuery) ||
            dept.location?.toLowerCase().includes(lowerQuery) ||
            dept.facilities?.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              type: 'department',
              id: dept._id,
              title: dept.name,
              subtitle: dept.location,
              description: dept.facilities
            });
          }
        });
      }

      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Keyboard shortcut for search and click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return '👤';
      case 'doctor': return '👨‍⚕️';
      case 'department': return '🏥';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'text-blue-600';
      case 'doctor': return 'text-green-600';
      case 'department': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const handleSearchSelect = (result: any) => {
    const message = `${result.title} (${result.type})`;
    toast.success(`Selected: ${message}`);
    
    // Navigate to relevant page based on type
    switch (result.type) {
      case 'patient':
        navigate('/patient-entry');
        break;
      case 'doctor':
        navigate('/doctors');
        break;
      case 'department':
        navigate('/departments');
        break;
      default:
        break;
    }
    
    setSearchOpen(false);
    setSearchQuery("");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'doctor': return 'bg-blue-500';
      case 'staff': return 'bg-green-500';
      case 'patient': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  return (
    <div className="flex bg-background min-h-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1 ml-64">
        <header className="h-16 sticky top-0 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hospital Management System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients, doctors... (Ctrl+K)" 
                  className="pl-10 w-64 bg-background/50 border-border/50 focus:bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchOpen && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
                  <CardContent className="p-0">
                    {isSearching && (
                      <div className="p-4 text-center text-muted-foreground">
                        <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Searching...
                      </div>
                    )}
                    
                    {!isSearching && searchResults.length === 0 && searchQuery && (
                      <div className="p-4 text-center text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                    
                    {!isSearching && searchResults.length === 0 && !searchQuery && (
                      <div className="p-4 text-center text-muted-foreground">
                        Start typing to search patients, doctors, and departments...
                      </div>
                    )}
                    
                    {searchResults.length > 0 && (
                      <div className="py-2">
                        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                          Search Results ({searchResults.length})
                        </div>
                        {searchResults.map((result, index) => (
                          <div
                            key={`${result.type}-${result.id}`}
                            className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                            onClick={() => handleSearchSelect(result)}
                          >
                            <span className="text-lg mt-0.5">{getTypeIcon(result.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">{result.title}</p>
                                <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                                  {result.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                              {result.phone && (
                                <p className="text-xs text-muted-foreground">{result.phone}</p>
                              )}
                              {result.description && (
                                <p className="text-xs text-muted-foreground truncate mt-1">{result.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {user ? getInitials(user.firstName, user.lastName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                            {user ? getInitials(user.firstName, user.lastName) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getRoleBadgeColor(user?.role || '')} text-white text-xs`}
                        >
                          {user?.role?.toUpperCase()}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          {user?.isEmailVerified ? (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                              <Mail className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                              <Mail className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                          
                          {user?.isPhoneVerified ? (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                              <Phone className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                              <Phone className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  {(!user?.isEmailVerified || !user?.isPhoneVerified) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Verify Account</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/30">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="p-4">
              <div className="relative mb-4" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients, doctors..." 
                  className="pl-10 pr-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Card className="max-h-96 overflow-y-auto">
                <CardContent className="p-0">
                  {isSearching && (
                    <div className="p-4 text-center text-muted-foreground">
                      <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  )}
                  
                  {!isSearching && searchResults.length === 0 && searchQuery && (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                  
                  {!isSearching && searchResults.length === 0 && !searchQuery && (
                    <div className="p-4 text-center text-muted-foreground">
                      Start typing to search patients, doctors, and departments...
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                        Search Results ({searchResults.length})
                      </div>
                      {searchResults.map((result, index) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSearchSelect(result)}
                        >
                          <span className="text-lg mt-0.5">{getTypeIcon(result.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{result.title}</p>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            {result.phone && (
                              <p className="text-xs text-muted-foreground">{result.phone}</p>
                            )}
                            {result.description && (
                              <p className="text-xs text-muted-foreground truncate mt-1">{result.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistantButton />
    </div>
  );
};
