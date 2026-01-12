import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  UserCog, 
  Stethoscope, 
  Building2, 
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Trash2
} from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDoctors(data);
      console.log('Doctors loaded:', data.length);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error("Failed to load doctors. Please check if the backend server is running.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDepartments(data);
      console.log('Departments loaded:', data.length);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error("Failed to load departments. Please check if the backend server is running.");
    }
  };

  const addDoctor = async () => {
    if (!name || !specialization || !department) {
      return toast.error("All fields required");
    }

    try {
      const res = await fetch(`${API_BASE}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialization, department }),
      });

      if (!res.ok) throw new Error();

      toast.success("Doctor added successfully!");
      setOpen(false);
      setName("");
      setSpecialization("");
      setDepartment("");
      fetchDoctors();
    } catch {
      toast.error("Error adding doctor");
    }
  };

  const deleteDoctor = async (doctorId: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/doctors/${doctorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete doctor");
      }

      toast.success("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Error deleting doctor");
    }
  };

  const filteredDoctors = doctors.filter((doc: any) =>
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const getSpecializationColor = (specialization: string) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800 border-red-200',
      'Neurology': 'bg-purple-100 text-purple-800 border-purple-200',
      'Orthopedics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pediatrics': 'bg-green-100 text-green-800 border-green-200',
      'General': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[specialization as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Medical Staff
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage doctors and medical professionals
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-4 h-4" /> Add Doctor
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                Add New Doctor
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  placeholder="Dr. John Smith"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input 
                  placeholder="e.g., Cardiology, Neurology"
                  value={specialization} 
                  onChange={(e) => setSpecialization(e.target.value)} 
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select onValueChange={setDepartment}>
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d: any) => (
                      <SelectItem key={d._id} value={d.name}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {d.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full gradient-primary text-white border-0" onClick={addDoctor}>
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-primary">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-success">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(doctors.map((d: any) => d.specialization)).size}</p>
                <p className="text-sm text-muted-foreground">Specializations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-info">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name, specialization, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/50 focus:border-primary"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Medical Staff Directory
            <Badge variant="secondary" className="ml-2">
              {filteredDoctors.length} doctors
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doc: any, index) => (
                <div 
                  key={doc._id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="gradient-primary text-white font-semibold">
                        {doc.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'DR'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{doc.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSpecializationColor(doc.specialization)}`}
                        >
                          <Stethoscope className="h-3 w-3 mr-1" />
                          {doc.specialization}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          {doc.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteDoctor(doc._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCog className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No doctors found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first doctor"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setOpen(true)} className="gradient-primary text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Doctor
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Doctors;
