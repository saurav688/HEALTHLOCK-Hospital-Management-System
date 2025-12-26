import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const Discharge = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState({
    dischargeDate: "",
    treatmentAdvice: "",
    treatmentGiven: "",
    medicines: "",
    paymentGiven: "",
  });

  const [bill, setBill] = useState({
    totalBill: 0,
    pending: 0,
  });

  const loadAdmissions = async () => {
    const res = await fetch(`${API_BASE}/admissions`);
    const data = await res.json();
    setAdmissions(data.filter((a: any) => !a.isDischarged));
  };

  const calcBill = () => {
    if (!selected?.admissionDate || !form.dischargeDate) return;

    const start = new Date(selected.admissionDate);
    const end = new Date(form.dischargeDate);

    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const roomCharge = selected.room?.dailyCharge || 0;
    const other = selected.room?.otherCharges || 0;

    const total = days * (roomCharge + other);
    const paid = Number(form.paymentGiven) || 0;

    setBill({
      totalBill: total,
      pending: Math.max(0, total - paid),
    });
  };

  const dischargePatient = async () => {
    if (!selected) return toast.error("Select admission first");

    try {
      await fetch(`${API_BASE}/admissions/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalBill: bill.totalBill,
          pendingAmount: bill.pending,
          isDischarged: true,
        }),
      });

      // Free Room
      await fetch(`${API_BASE}/rooms/${selected.room?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Available" }),
      });

      toast.success("Patient discharged successfully");
      setSelected(null);
      setForm({
        dischargeDate: "",
        medicines: "",
        paymentGiven: "",
        treatmentAdvice: "",
        treatmentGiven: "",
      });
      setBill({ totalBill: 0, pending: 0 });
      loadAdmissions();
    } catch {
      toast.error("Error during discharge");
    }
  };

  useEffect(() => {
    loadAdmissions();
  }, []);

  useEffect(() => {
    calcBill();
  }, [form.dischargeDate, form.paymentGiven]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Patient Discharge</h2>

      {/* Select Admitted Patient */}
      <Card>
        <CardHeader>
          <CardTitle>Select Admitted Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={(id) => {
            const admission = admissions.find((a) => a._id === id);
            setSelected(admission || null);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose patient" />
            </SelectTrigger>
            <SelectContent>
              {admissions.map((a: any) => (
                <SelectItem key={a._id} value={a._id}>
                  {a.patient?.name} — Room {a.room?.roomNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selected && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Patient Info */}
          <Card>
            <CardHeader><CardTitle>Patient & Stay Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Patient Name</Label>
                <Input disabled value={selected.patient?.name || ""} />
              </div>

              <div>
                <Label>Room</Label>
                <Input disabled value={`Room ${selected.room?.roomNo} (${selected.room?.type})`} />
              </div>

              <div>
                <Label>Admission Date</Label>
                <Input disabled value={selected.admissionDate || ""} />
              </div>

              <div>
                <Label>Discharge Date</Label>
                <Input
                  type="date"
                  value={form.dischargeDate}
                  onChange={(e) => setForm({ ...form, dischargeDate: e.target.value })}
                />
              </div>

              <Textarea
                placeholder="Treatment Advice"
                value={form.treatmentAdvice}
                onChange={(e) => setForm({ ...form, treatmentAdvice: e.target.value })}
              />

              <Textarea
                placeholder="Treatment Given"
                value={form.treatmentGiven}
                onChange={(e) => setForm({ ...form, treatmentGiven: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Billing */}
          <Card>
            <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Medicines Prescribed"
                value={form.medicines}
                onChange={(e) => setForm({ ...form, medicines: e.target.value })}
              />

              <Input
                type="number"
                placeholder="Payment Given"
                value={form.paymentGiven}
                onChange={(e) => setForm({ ...form, paymentGiven: e.target.value })}
              />

              <Input disabled value={`₹ ${bill.totalBill}`} placeholder="Total Bill" />
              <Input disabled value={`₹ ${bill.pending}`} placeholder="Pending Amount" />

              <Button className="w-full" onClick={dischargePatient}>
                Confirm Discharge
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Discharge;
