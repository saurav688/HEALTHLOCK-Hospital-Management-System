import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Operations = () => {
  const [operations, setOperations] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({
    patient: "",
    operationType: "",
    doctor: "",
    operationDate: "",
    room: "",
    duration: "60",
    notes: "",
    preOpInstructions: "",
    postOpInstructions: "",
  });

  const loadOperations = async () => {
    try {
      const res = await fetch(`${API_BASE}/operations`);
      const data = await res.json();
      setOperations(data);
    } catch (error) {
      console.error("Error loading operations:", error);
      toast.error("Failed to load operations");
    }
  };

  const loadPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const loadRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      const data = await res.json();
      setRooms(data.filter((room: any) => room.status === "Available"));
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const submitOperation = async () => {
    if (!form.patient || !form.operationType || !form.doctor || !form.operationDate) {
      return toast.error("Please fill all required fields!");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to schedule operation");
      }

      toast.success("Operation scheduled successfully!");
      loadOperations();
      setDialogOpen(false);
      setForm({
        patient: "",
        operationType: "",
        doctor: "",
        operationDate: "",
        room: "",
        duration: "60",
        notes: "",
        preOpInstructions: "",
        postOpInstructions: "",
      });
    } catch (error) {
      console.error("Error scheduling operation:", error);
      toast.error("Error scheduling operation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperations();
    loadPatients();
    loadRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success text-success-foreground";
      case "In Progress":
        return "bg-warning text-warning-foreground";
      case "Cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-info text-info-foreground";
    }
  };

  const deleteOperation = async (operationId: string) => {
    if (!confirm("Are you sure you want to delete this operation?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/operations/${operationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete operation");
      }

      toast.success("Operation deleted successfully!");
      loadOperations();
    } catch (error) {
      console.error("Error deleting operation:", error);
      toast.error("Error deleting operation");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Operations</h2>
          <p className="text-muted-foreground mt-2">Manage patient operations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Operation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Operation</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select value={form.patient} onValueChange={(value) => setForm({ ...form, patient: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.name} - {patient.age} yrs
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationType">Operation Type *</Label>
                <Input
                  id="operationType"
                  value={form.operationType}
                  onChange={(e) => setForm({ ...form, operationType: e.target.value })}
                  placeholder="e.g., Cardiac Surgery, Appendectomy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Input
                  id="doctor"
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationDate">Operation Date *</Label>
                <Input
                  id="operationDate"
                  type="datetime-local"
                  value={form.operationDate}
                  onChange={(e) => setForm({ ...form, operationDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Operating Room</Label>
                <Select value={form.room} onValueChange={(value) => setForm({ ...form, room: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        {room.roomNumber} - {room.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes about the operation"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="preOpInstructions">Pre-Operation Instructions</Label>
                <Textarea
                  id="preOpInstructions"
                  value={form.preOpInstructions}
                  onChange={(e) => setForm({ ...form, preOpInstructions: e.target.value })}
                  placeholder="Instructions for patient before operation"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="postOpInstructions">Post-Operation Instructions</Label>
                <Textarea
                  id="postOpInstructions"
                  value={form.postOpInstructions}
                  onChange={(e) => setForm({ ...form, postOpInstructions: e.target.value })}
                  placeholder="Instructions for patient after operation"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitOperation} disabled={loading}>
                {loading ? "Scheduling..." : "Schedule Operation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient No</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Operation Type</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((operation) => (
                <TableRow key={operation._id}>
                  <TableCell className="font-medium">
                    {operation.patient?.name ? `P${operation.patient.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}` : 'N/A'}
                  </TableCell>
                  <TableCell>{operation.patient?.name || 'Unknown'}</TableCell>
                  <TableCell>{operation.operationType}</TableCell>
                  <TableCell>{operation.doctor}</TableCell>
                  <TableCell>{formatDate(operation.operationDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(operation.status)}>{operation.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteOperation(operation._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {operations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No operations scheduled
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Operations;
