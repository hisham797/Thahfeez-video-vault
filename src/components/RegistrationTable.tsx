import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface Registration {
  _id: string;
  name: string;
  email: string;
  organization: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  showingText: string;
}

export function RegistrationTable({ registrations, showingText }: RegistrationTableProps) {
  return (
    <div className="bg-[#1A1F2C]/80 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <p className="text-sm text-gray-400">{showingText}</p>
                  </div>
      
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800">
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400">Email</TableHead>
            <TableHead className="text-gray-400">Organization</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration._id} className="border-gray-800 hover:bg-gray-800/20">
              <TableCell className="font-medium text-white">{registration.name}</TableCell>
              <TableCell className="text-gray-300">{registration.email}</TableCell>
              <TableCell className="text-gray-300">{registration.organization}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    registration.status === 'approved' ? 'success' :
                    registration.status === 'pending' ? 'warning' : 'destructive'
                  }
                >
                  {registration.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                {format(new Date(registration.createdAt), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
