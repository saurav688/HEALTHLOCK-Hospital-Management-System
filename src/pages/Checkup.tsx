import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const Checkup = () => {
  const [checkups, setCheckups] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    status: "Pending",
  });

  const loadCheckups = async () => {
    const res = await fetch(`${API_BASE}/checkups`);
    const data = await res.json();
    setCheckups(data);
  };

  const loadPatients = async () => {
    const res = await fetch(`${API_BASE}/patients`);
    const data = await res.json();
    setPatients(data);
  };

  const submitCheckup = async () => {
    if (!form.patient || !form.diagnosis || !form.doctor)
      return toast.error("Fill all details!");

    setLoading(true);

    const res = await fetch(`${API_BASE}/checkups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) return toast.error("Error adding checkup");
    toast.success("Checkup Added!");
    loadCheckups();

    setForm({
      patient: "",
      doctor: "",
      diagnosis: "",
      status: "Pending",
    });
  };

  useEffect(() => {
    loadCheckups();
    loadPatients();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success text-success-foreground";
      case "In Progress":
        return "bg-warning text-warning-foreground";
      case "Pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Patient Checkup</h2>
          <p className="text-muted-foreground">Manage & update patient checkups</p>
        </div>

        {/* Add Checkup Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Checkup
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Checkup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">

              {/* Select Patient */}
              <div>
                <Label>Patient</Label>
                <Select onValueChange={(v) => setForm({ ...form, patient: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p: any) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name} — {p.age} yrs
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Doctor Name</Label>
                <Input
                  placeholder="Doctor Name"
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                />
              </div>

              <div>
                <Label>Diagnosis</Label>
                <Textarea
                  placeholder="Enter diagnosis"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                />
              </div>

              <Button
                className="w-full"
                disabled={loading}
                onClick={submitCheckup}
              >
                {loading ? "Saving..." : "Save Checkup"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Checkup List */}
      <Card>
        <CardHeader><CardTitle>Checkup Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {checkups.map((c: any) => (
                <TableRow key={c._id}>
                  <TableCell>{c.patient?.name}</TableCell>
                  <TableCell>{c.doctor}</TableCell>
                  <TableCell>{c.diagnosis}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
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

export default Checkup;
