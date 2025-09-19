'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: number;
  message: string;
  isFromUser: boolean;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'medium' });
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) return;

    try {
      setSubmitting(true);
      await api.createTicket(newTicket.subject, newTicket.message);
      await fetchTickets();
      setNewTicket({ subject: '', message: '', priority: 'medium' });
      setShowNewTicketForm(false);
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      alert(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      setSubmitting(true);
      await api.replyToTicket(selectedTicket.id, replyMessage);
      // Refresh the selected ticket
      const response = await api.getTicket(selectedTicket.id);
      setSelectedTicket(response.data);
      setReplyMessage('');
      await fetchTickets(); // Refresh tickets list
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      alert(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
              <p className="text-gray-300">Get help with your account and investments</p>
            </div>
            <button
              onClick={() => setShowNewTicketForm(true)}
              className="btn-primary px-6 py-3 rounded-xl font-semibold"
            >
              New Ticket
            </button>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tickets List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Tickets</h2>
            
            {tickets.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl border border-white/20 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Support Tickets</h3>
                <p className="text-gray-400 text-sm">Create your first support ticket to get help.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`glass-card p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedTicket?.id === ticket.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white text-sm truncate">
                        {ticket.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`px-2 py-1 rounded border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Ticket Details/Conversation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {selectedTicket ? (
              <div className="glass-card p-6 rounded-2xl border border-white/20 h-[600px] flex flex-col">
                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{selectedTicket.subject}</h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</div>
                    <div>Updated: {new Date(selectedTicket.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {selectedTicket.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isFromUser
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'bg-white/5 border border-white/20'
                        }`}
                      >
                        <div className="text-sm text-white mb-1">{message.message}</div>
                        <div className="text-xs text-gray-400">
                          {message.author.firstName} {message.author.lastName} - {' '}
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'closed' && (
                  <form onSubmit={sendReply} className="mt-auto">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={submitting || !replyMessage.trim()}
                        className="btn-primary px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                      >
                        {submitting ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="glass-card p-12 rounded-2xl border border-white/20 text-center h-[600px] flex items-center justify-center">
                <div>
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Ticket</h3>
                  <p className="text-gray-400">Choose a ticket from the list to view the conversation</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewTicketForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 rounded-2xl border border-white/20 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Create New Ticket</h3>
              
              <form onSubmit={createTicket} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketForm(false)}
                    className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newTicket.subject || !newTicket.message}
                    className="flex-1 btn-primary py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}