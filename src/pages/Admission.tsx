import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const Admission = () => {
  const [patients, setPatients] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    room: "",
    department: "",
    admissionDate: "",
    attendantName: "",
    condition: "",
    investigation: "",
    advancePayment: "",
    paymentMode: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const loadData = async () => {
    setPatients(await (await fetch(`${API_BASE}/patients`)).json());
    setAvailableRooms(await (await fetch(`${API_BASE}/rooms?status=Available`)).json());
    setAdmissions(await (await fetch(`${API_BASE}/admissions`)).json());
  };

  const submitAdmission = async () => {
    if (!form.patient || !form.room || !form.admissionDate)
      return toast.error("Please fill required fields!");

    try {
      const res = await fetch(`${API_BASE}/admissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      // Mark room as Occupied in DB
      await fetch(`${API_BASE}/rooms/${form.room}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Occupied" }),
      });

      toast.success("Patient admitted successfully! 🎉");
      loadData();
      setForm({
        patient: "",
        room: "",
        department: "",
        admissionDate: "",
        attendantName: "",
        condition: "",
        investigation: "",
        advancePayment: "",
        paymentMode: "",
      });
    } catch {
      toast.error("Error admitting patient");
    }
  };

  const deleteAdmission = async (admissionId: string, roomId: string) => {
    if (!confirm("Are you sure you want to delete this admission?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admissions/${admissionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete admission");
      }

      // Mark room as Available again
      if (roomId) {
        await fetch(`${API_BASE}/rooms/${roomId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Available" }),
        });
      }

      toast.success("Admission deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting admission:", error);
      toast.error("Error deleting admission");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Patient Admission</h2>

      {/* 🔹 Admission Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient & Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Patient */}
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select onValueChange={(v) => handleChange("patient", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p: any) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name} (Age: {p.age})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label>Room</Label>
              <Select onValueChange={(v) => handleChange("room", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((r: any) => (
                    <SelectItem key={r._id} value={r._id}>
                      Room {r.roomNo} - {r.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="e.g. Cardiology"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Admission Date</Label>
              <Input
                type="date"
                value={form.admissionDate}
                onChange={(e) => handleChange("admissionDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Attendant Name</Label>
              <Input
                placeholder="Enter attendant name"
                value={form.attendantName}
                onChange={(e) => handleChange("attendantName", e.target.value)}
              />
            </div>

          </CardContent>
        </Card>

        {/* Medical Details */}
        <Card>
          <CardHeader><CardTitle>Medical & Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <Textarea
              placeholder="Condition on admission"
              value={form.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
            />

            <Textarea
              placeholder="Investigations done"
              value={form.investigation}
              onChange={(e) => handleChange("investigation", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Advance Payment"
                value={form.advancePayment}
                onChange={(e) => handleChange("advancePayment", e.target.value)}
              />

              <Select onValueChange={(v) => handleChange("paymentMode", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={submitAdmission}>
              Admit Patient
            </Button>

          </CardContent>
        </Card>
      </div>

      {/* 🔹 Admission Records List */}
      <Card>
        <CardHeader><CardTitle>Admission List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((a: any) => (
                <TableRow key={a._id}>
                  <TableCell>{a.patient?.name}</TableCell>
                  <TableCell>Room {a.room?.roomNo}</TableCell>
                  <TableCell>{new Date(a.admissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>{a.patient?.department || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteAdmission(a._id, a.room?._id)}
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

export default Admission;
