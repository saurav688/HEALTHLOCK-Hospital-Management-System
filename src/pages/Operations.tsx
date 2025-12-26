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
import { Eye, Plus } from "lucide-react";

const operations = [
  { id: 1, patientNo: "P001", patientName: "John Doe", operationType: "Cardiac Surgery", doctor: "Dr. Smith", date: "2025-01-20", status: "Scheduled" },
  { id: 2, patientNo: "P002", patientName: "Jane Smith", operationType: "Appendectomy", doctor: "Dr. Johnson", date: "2025-01-18", status: "Completed" },
  { id: 3, patientNo: "P003", patientName: "Bob Wilson", operationType: "Knee Replacement", doctor: "Dr. Brown", date: "2025-01-22", status: "Scheduled" },
];

const Operations = () => {
  const getStatusColor = (status: string) => {
    return status === "Completed" 
      ? "bg-success text-success-foreground" 
      : "bg-info text-info-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Operations</h2>
          <p className="text-muted-foreground mt-2">Manage patient operations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Operation
        </Button>
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
                <TableRow key={operation.id}>
                  <TableCell className="font-medium">{operation.patientNo}</TableCell>
                  <TableCell>{operation.patientName}</TableCell>
                  <TableCell>{operation.operationType}</TableCell>
                  <TableCell>{operation.doctor}</TableCell>
                  <TableCell>{operation.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(operation.status)}>{operation.status}</Badge>
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

export default Operations;
