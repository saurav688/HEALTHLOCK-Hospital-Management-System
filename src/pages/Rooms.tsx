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
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);

  const [roomNo, setRoomNo] = useState("");
  const [type, setType] = useState("");
  const [dailyCharge, setDailyCharge] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [status] = useState("Available");

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      setRooms(await res.json());
    } catch (err) {
      toast.error("Failed to load rooms");
    }
  };

  const addRoom = async () => {
    if (!roomNo || !type || !dailyCharge) {
      return toast.error("All fields required");
    }

    try {
      const res = await fetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNo,
          type,
          dailyCharge,
          otherCharges,
          status,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Room Added Successfully");

      setOpen(false);
      setRoomNo("");
      setType("");
      setDailyCharge("");
      setOtherCharges("");
      fetchRooms();
    } catch {
      toast.error("Error adding room");
    }
  };

  const getCounts = (label: string) =>
    rooms.filter((r: any) => r.status === label).length;

  useEffect(() => {
    fetchRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500 text-white";
      case "Occupied":
        return "bg-yellow-500 text-black";
      case "Maintenance":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-black";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Room Management</h2>
          <p className="text-muted-foreground">Manage hospital rooms</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Room</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Room No" value={roomNo} onChange={(e)=>setRoomNo(e.target.value)} />
              <Input placeholder="Type (ICU / General / Private)" value={type} onChange={(e)=>setType(e.target.value)} />
              <Input placeholder="Daily Charges" type="number" value={dailyCharge} onChange={(e)=>setDailyCharge(e.target.value)} />
              <Input placeholder="Other Charges" type="number" value={otherCharges} onChange={(e)=>setOtherCharges(e.target.value)} />
              <Button className="w-full" onClick={addRoom}>Save Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ROOM STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Available Rooms</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">{getCounts("Available")}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Occupied Rooms</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-600">{getCounts("Occupied")}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Maintenance</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-600">{getCounts("Maintenance")}</div></CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader><CardTitle>Room List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Charge</TableHead>
                <TableHead>Other Charges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room: any) => (
                <TableRow key={room._id}>
                  <TableCell>{room.roomNo}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell><Badge className={getStatusColor(room.status)}>{room.status}</Badge></TableCell>
                  <TableCell>{room.dailyCharge}</TableCell>
                  <TableCell>{room.otherCharges || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default Rooms;
