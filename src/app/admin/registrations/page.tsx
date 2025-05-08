"use client";

import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, CheckCircle, XCircle } from "lucide-react";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  ticketType?: string;
  additionalInfo?: string;
}

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Error",
        description: "Failed to load registrations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      if (!id) {
        throw new Error('Registration ID is required');
      }

      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update registration status');
      }

      // Update the local state with the new registration data
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg._id === id 
            ? { ...reg, status: newStatus, updatedAt: new Date().toISOString() }
            : reg
        )
      );
      
      toast({
        title: "Success",
        description: data.message || "Registration status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      registration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Registrations</h1>
            <p className="text-gray-400 mt-1">Manage event registrations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search registrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1F2C] border-gray-800 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-[#1A1F2C] border-gray-800 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-[#1A1F2C]/80 rounded-lg border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Organization</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration, index) => (
                  <TableRow 
                    key={registration._id ? `registration-${registration._id}` : `registration-${index}`}
                    className="border-gray-800 hover:bg-gray-800/20 cursor-pointer"
                    onClick={() => {
                      setSelectedRegistration(registration);
                      setViewDialogOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{registration.name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.organization}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(registration.status)}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(registration.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {registration.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(registration._id, 'approved');
                            }}
                            className="text-green-500 hover:bg-green-500/20 hover:text-green-400"
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(registration._id, 'rejected');
                            }}
                            className="text-red-500 hover:bg-red-500/20 hover:text-red-400"
                          >
                            <XCircle size={16} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <UserPlus size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Registrations</h3>
              <p className="text-gray-400">No registrations found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* View Registration Dialog */}
        <AlertDialog 
          open={viewDialogOpen} 
          onOpenChange={setViewDialogOpen}
        >
          <AlertDialogContent className="bg-[#1A1F2C] border-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Registration Details</AlertDialogTitle>
            </AlertDialogHeader>
            {selectedRegistration && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Organization</p>
                    <p className="text-white">{selectedRegistration.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ticket Type</p>
                    <p className="text-white">{selectedRegistration.ticketType || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Registration Date</p>
                    <p className="text-white">{formatDate(selectedRegistration.createdAt)}</p>
                  </div>
                </div>
                {selectedRegistration.additionalInfo && (
                  <div>
                    <p className="text-sm text-gray-400">Additional Information</p>
                    <p className="text-white">{selectedRegistration.additionalInfo}</p>
                  </div>
                )}
                {selectedRegistration.status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedRegistration._id, 'approved')}
                      className="text-green-500 border-green-500/30 hover:bg-green-500/20"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedRegistration._id, 'rejected')}
                      className="text-red-500 border-red-500/30 hover:bg-red-500/20"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRegistrations;
