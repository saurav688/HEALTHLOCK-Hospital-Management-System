import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Users, 
  UserCog, 
  BedDouble, 
  Activity, 
  TrendingUp, 
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Heart,
  UserPlus,
  AlertCircle,
  Loader2,
  Bot,
  Sparkles
} from "lucide-react";

interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  department?: string;
  doctor?: string;
  status: string;
  createdAt: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization?: string;
  department?: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt: string;
}

interface Room {
  _id: string;
  roomNo: string;
  type?: string;
  status: string;
  dailyCharge?: number;
  otherCharges?: number;
  createdAt: string;
}

interface Admission {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  room?: Room;
  admissionDate: string;
  reason?: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    roomsAvailable: 0,
    operations: 0,
  });

  const [recentAdmissions, setRecentAdmissions] = useState<Admission[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test backend connection first
      const healthCheck = await fetch(`${API_BASE}/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend server is not responding');
      }

      // Fetch all data in parallel
      const [patientsRes, doctorsRes, roomsRes, admissionsRes] = await Promise.all([
        fetch(`${API_BASE}/patients`).catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch(`${API_BASE}/doctors`).catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch(`${API_BASE}/rooms`).catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch(`${API_BASE}/admissions`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      ]);

      // Parse responses
      const patients: Patient[] = patientsRes.ok ? await patientsRes.json() : [];
      const doctors: Doctor[] = doctorsRes.ok ? await doctorsRes.json() : [];
      const rooms: Room[] = roomsRes.ok ? await roomsRes.json() : [];
      const admissions: Admission[] = admissionsRes.ok ? await admissionsRes.json() : [];

      // Filter available rooms
      const availableRooms = rooms.filter(room => 
        room.status?.toLowerCase() === 'available'
      );

      // Get today's date for filtering
      const today = new Date().toISOString().split('T')[0];
      const todaysAdmissions = admissions.filter(admission => 
        admission.admissionDate?.startsWith(today) || 
        admission.createdAt?.startsWith(today)
      );

      // Update stats
      setStats({
        patients: patients.length,
        doctors: doctors.filter(doc => doc.status !== 'Inactive').length,
        roomsAvailable: availableRooms.length,
        operations: todaysAdmissions.length, // Using today's admissions as operations
      });

      // Set recent admissions (last 5)
      setRecentAdmissions(admissions.slice(0, 5));
      
      // Set today's schedule (today's admissions)
      setTodaySchedule(todaysAdmissions.slice(0, 5));

      console.log('Dashboard data loaded successfully:', {
        patients: patients.length,
        doctors: doctors.length,
        rooms: rooms.length,
        admissions: admissions.length
      });

    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardStats = [
    {
      title: "Total Patients",
      value: stats.patients,
      icon: Users,
      description: "Active patients in system",
      gradient: "gradient-primary",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Medical Staff",
      value: stats.doctors,
      icon: UserCog,
      description: "Doctors on duty",
      gradient: "gradient-success",
      trend: "+3%",
      trendUp: true,
    },
    {
      title: "Available Rooms",
      value: stats.roomsAvailable,
      icon: BedDouble,
      description: "Ready for admission",
      gradient: "gradient-info",
      trend: "85%",
      trendUp: true,
    },
    {
      title: "Admissions Today",
      value: stats.operations,
      icon: Activity,
      description: "Today's admissions",
      gradient: "gradient-warning",
      trend: "+8%",
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's what's happening at your hospital today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Heart className="h-3 w-3 mr-1 text-red-500" />
            Backend Connected
          </Badge>
        </div>
      </div>

      {/* AI Assistant Notification */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">🎉 New: AI Voice Assistant Available!</h3>
              <p className="text-sm text-muted-foreground">
                Ask about medications, book appointments, and get medical guidance using voice commands. 
                Look for the AI button in the bottom right corner or visit the AI Assistant page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                New Feature
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cardStats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="card-hover border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Progress value={75} className="h-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Admissions - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                Recent Admissions
              </CardTitle>
              <Badge variant="secondary">
                {recentAdmissions.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAdmissions.length > 0 ? recentAdmissions.map((admission, i) => (
                <div key={admission._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {admission.patient?.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{admission.patient?.name || 'Unknown Patient'}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>Room {admission.room?.roomNo || 'TBD'}</span>
                        <span>•</span>
                        <span>Dr. {admission.doctor?.name || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {new Date(admission.admissionDate || admission.createdAt).toLocaleDateString()}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{admission.status || 'Admitted'}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BedDouble className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent admissions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Today's Admissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.length > 0 ? todaySchedule.map((admission, i) => (
                <div key={admission._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-white text-xs font-bold">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-primary">
                        {new Date(admission.admissionDate || admission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Badge variant="outline" size="sm">
                        <Stethoscope className="h-2 w-2 mr-1" />
                        Admission
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground font-medium truncate">
                      {admission.patient?.name || 'Patient'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dr. {admission.doctor?.name || 'TBD'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No admissions today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "New Patient", icon: UserPlus, color: "from-blue-500 to-blue-600", path: "/patient-entry" },
              { title: "New Admission", icon: BedDouble, color: "from-green-500 to-green-600", path: "/admission" },
              { title: "Room Management", icon: BedDouble, color: "from-purple-500 to-purple-600", path: "/rooms" },
              { title: "Add Doctor", icon: UserCog, color: "from-red-500 to-red-600", path: "/doctors" },
            ].map((action, index) => (
              <div 
                key={action.title}
                className="p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => window.location.href = action.path}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-sm">{action.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
