'use client';
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
import { Mail, Trash, CheckCircle, XCircle } from "lucide-react";
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

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.map((msg: Message) => ({ ...msg, read: msg.read || false })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const unreadCount = messages.filter(msg => !msg.read).length;
  
  const handleDeleteMessage = (message: Message) => {
    setSelectedMessage(message);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedMessage) return;
    
    try {
      const response = await fetch(`/api/admin/messages?id=${selectedMessage._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete message');
      }

      // Update local state only after successful deletion
      setMessages(messages.filter(msg => msg._id !== selectedMessage._id));
    
    toast({
        title: "Success",
        description: "Message has been deleted successfully."
    });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete message. Please try again.",
        variant: "destructive"
      });
    } finally {
    setDeleteDialogOpen(false);
    setSelectedMessage(null);
    }
  };
  
  const viewMessage = (message: Message) => {
    // Mark as read if unread
    if (!message.read) {
      const updatedMessages = messages.map(msg => 
        msg._id === message._id ? { ...msg, read: true } : msg
      );
      setMessages(updatedMessages);
    }
    
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <AdminLayout>
      <div className="p-6 md:p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-gray-400 mt-1">Manage incoming contact messages</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-indigo-500">
              {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </Badge>
          )}
        </div>
        
        <div className="bg-[#1A1F2C]/80 rounded-lg border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Sender</TableHead>
                  <TableHead className="text-gray-400">Subject</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow 
                    key={message._id} 
                    className="border-gray-800 hover:bg-gray-800/20 cursor-pointer" 
                    onClick={() => viewMessage(message)}
                  >
                    <TableCell>
                      <Badge variant={message.read ? "outline" : "default"} className={message.read ? "text-gray-400 border-gray-500" : "bg-indigo-500"}>
                        {message.read ? "Read" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{message.name}</div>
                      <div className="text-sm text-gray-400">{message.email}</div>
                    </TableCell>
                    <TableCell className="text-white">{message.subject}</TableCell>
                    <TableCell className="text-gray-400">{formatDate(message.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message);
                        }}
                        className="text-red-500 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Mail size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Messages</h3>
              <p className="text-gray-400">You don't have any messages yet.</p>
            </div>
          )}
        </div>
        
        {/* View Message Dialog */}
        <AlertDialog 
          open={viewDialogOpen} 
          onOpenChange={setViewDialogOpen}
        >
          <AlertDialogContent className="bg-[#1A1F2C] border-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">{selectedMessage?.subject}</AlertDialogTitle>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>From: {selectedMessage?.name} ({selectedMessage?.email})</span>
                <span>{selectedMessage && formatDate(selectedMessage.createdAt)}</span>
              </div>
            </AlertDialogHeader>
            <div className="py-4 my-2 border-t border-b border-gray-800">
              <p className="text-gray-300">{selectedMessage?.message}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white">
                Close
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedMessage && handleDeleteMessage(selectedMessage)}
                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              >
                <Trash size={16} className="mr-2" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-[#1A1F2C] border-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
