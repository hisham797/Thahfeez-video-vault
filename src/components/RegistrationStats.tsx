import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, XCircle, Calendar } from "lucide-react";

interface RegistrationStatsProps {
  totalRegistrations: number;
  acceptedRegistrations: number;
  pendingRegistrations: number;
  rejectedRegistrations: number;
  todayRegistrations: number;
}

export function RegistrationStats({
  totalRegistrations,
  acceptedRegistrations,
  pendingRegistrations,
  rejectedRegistrations,
  todayRegistrations
}: RegistrationStatsProps) {
  return (
    <Card className="bg-[#1A1F2C]/80 border border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Registration Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Accepted Registrations</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{acceptedRegistrations}</span>
              <span className="text-xs text-gray-400">
                ({acceptedRegistrations > 0 ? (acceptedRegistrations / totalRegistrations * 100).toFixed(0) : 0}%)
              </span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div 
            className="bg-green-500 h-1.5 rounded-full" 
            style={{ width: `${acceptedRegistrations > 0 ? (acceptedRegistrations / totalRegistrations * 100) : 0}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Pending Registrations</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{pendingRegistrations}</span>
              <span className="text-xs text-gray-400">
                ({pendingRegistrations > 0 ? (pendingRegistrations / totalRegistrations * 100).toFixed(0) : 0}%)
              </span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div 
            className="bg-yellow-500 h-1.5 rounded-full" 
            style={{ width: `${pendingRegistrations > 0 ? (pendingRegistrations / totalRegistrations * 100) : 0}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Rejected Registrations</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{rejectedRegistrations}</span>
              <span className="text-xs text-gray-400">
                ({rejectedRegistrations > 0 ? (rejectedRegistrations / totalRegistrations * 100).toFixed(0) : 0}%)
              </span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div 
            className="bg-red-500 h-1.5 rounded-full" 
            style={{ width: `${rejectedRegistrations > 0 ? (rejectedRegistrations / totalRegistrations * 100) : 0}%` }}
          ></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-800 space-y-4">
          <div className="flex justify-between">
          <span className="text-gray-400">Total Registrations</span>
          <span className="text-white font-medium">{totalRegistrations}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Today's Registrations</span>
          <span className="text-white font-medium">{todayRegistrations}</span>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
