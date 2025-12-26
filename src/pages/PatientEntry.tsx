import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PatientEntry = () => {
  const { register, handleSubmit, setValue, reset } = useForm();

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to add patient ❌");
      }

      toast.success("Patient Registered Successfully! 🎉");
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient Entry</h2>
          <p className="text-muted-foreground mt-2">Register new patient</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input placeholder="Enter full name" {...register("name", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" placeholder="Enter age" {...register("age")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select onValueChange={(v) => setValue("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="Enter phone number" {...register("phone")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Enter full address" {...register("address")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Enter city" {...register("city")} />
                </div>

                <div className="space-y-2">
                  <Label>RFD</Label>
                  <Input placeholder="Rural / Urban" {...register("rfd")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select onValueChange={(v) => setValue("department", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Initial Diagnosis</Label>
                <Textarea placeholder="Enter diagnosis" {...register("initialDiagnosis")} />
              </div>

              <div className="space-y-2">
                <Label>Referring Consultant</Label>
                <Input placeholder="Doctor name" {...register("referringConsultant")} />
              </div>

              <div className="space-y-2">
                <Label>Checkup Date</Label>
                <Input type="date" {...register("checkupDate")} />
              </div>

              <Button type="submit" className="w-full">
                Register Patient
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default PatientEntry;
