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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      setDoctors(await res.json());
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      setDepartments(await res.json());
    } catch {
      toast.error("Failed to load departments");
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

      toast.success("Doctor added!");
      setOpen(false);
      setName("");
      setSpecialization("");
      setDepartment("");
      fetchDoctors();
    } catch {
      toast.error("Error adding doctor");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Doctors</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Doctor
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new doctor</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Specialization</label>
                <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Department</label>
                <Select onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d: any) => (
                      <SelectItem key={d._id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={addDoctor}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctors List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {doctors.map((doc: any) => (
                <TableRow key={doc._id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>{doc.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Doctors;
