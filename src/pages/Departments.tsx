import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [facilities, setFacilities] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      toast.error("Failed to fetch departments ❌");
    }
  };

  const addDepartment = async () => {
    if (!name.trim()) {
      return toast.error("Department name required");
    }

    try {
      const res = await fetch(`${API_BASE}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, facilities }),
      });

      if (!res.ok) throw new Error("Add Failed");

      toast.success("Department Added! 🎉");
      setName("");
      setLocation("");
      setFacilities("");
      setOpen(false);
      fetchDepartments();
    } catch {
      toast.error("Error adding department ❌");
    }
  };

  const deleteDepartment = async (departmentId: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/departments/${departmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete department");
      }

      toast.success("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Departments</h2>
          <p className="text-muted-foreground mt-2">Manage hospital departments</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Department
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cardiology" />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building A, Floor 3" />
              </div>

              <div className="space-y-2">
                <Label>Facilities</Label>
                <Textarea value={facilities} onChange={(e) => setFacilities(e.target.value)} placeholder="ECG, Echo, Cath Lab" />
              </div>

              <Button onClick={addDepartment} className="w-full">Save Department</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {departments.map((dep: any) => (
                <TableRow key={dep._id}>
                  <TableCell className="font-medium">{dep.name}</TableCell>
                  <TableCell>{dep.location || "-"}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={dep.facilities}>
                      {dep.facilities || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteDepartment(dep._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Departments;
