import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, BedDouble, Activity } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    roomsAvailable: 0,
    operations: 0,
  });

  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  const loadDashboardData = async () => {
  try {
    const patientData = await (await fetch(`${API_BASE}/patients`)).json();
    const doctorData = await (await fetch(`${API_BASE}/doctors`)).json();
    const availableRooms = await (
      await fetch(`${API_BASE}/rooms?status=Available`)
    ).json();
    const admissionData = await (
      await fetch(`${API_BASE}/admissions`)
    ).json();
    const checkups = await (
      await fetch(`${API_BASE}/checkups`)
    ).json();

    setStats({
      patients: patientData.length || 0,
      doctors: doctorData.length || 0,
      roomsAvailable: availableRooms.length || 0,
      operations: checkups.length || 0,
    });

    setRecentAdmissions(admissionData.slice(0, 3));
    setTodaySchedule(checkups.slice(0, 3));
  } catch (err) {
    console.error("Dashboard Load Error:", err);
  }
};


  useEffect(() => {
    loadDashboardData();
  }, []);

  const cardStats = [
    {
      title: "Total Patients",
      value: stats.patients,
      icon: Users,
      description: "Active patients in system",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Doctors",
      value: stats.doctors,
      icon: UserCog,
      description: "Medical staff on duty",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Available Rooms",
      value: stats.roomsAvailable,
      icon: BedDouble,
      description: "Rooms ready for admission",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Operations Today",
      value: stats.operations,
      icon: Activity,
      description: "Scheduled procedures",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to the Hospital Management System
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cardStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Admissions */}
        <Card>
          <CardHeader><CardTitle>Recent Admissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAdmissions.map((adm, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{adm.patient?.name}</p>
                    <p className="text-sm text-muted-foreground">Room {adm.room?.roomNo}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {adm.admissionDate.slice(0, 10)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0">
                  <span className="text-sm font-medium text-primary min-w-[80px]">
                    {item.createdAt?.slice(11, 16) || "00:00"}
                  </span>
                  <p className="text-sm">
                    {item.patient?.name} - {item.doctor}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
