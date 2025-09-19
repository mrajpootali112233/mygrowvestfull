'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalDeposits: number;
  totalWithdrawals: number;
  activeInvestments: number;
  totalEarnings: number;
  referralCode: string;
  referredBy?: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      setUsers([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'USER',
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z',
          totalDeposits: 5000,
          totalWithdrawals: 1200,
          activeInvestments: 2,
          totalEarnings: 850,
          referralCode: 'JD001'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'USER',
          isActive: false,
          createdAt: '2024-02-01T00:00:00Z',
          totalDeposits: 3000,
          totalWithdrawals: 0,
          activeInvestments: 1,
          totalEarnings: 450,
          referralCode: 'JS002'
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && user.isActive) || 
      (filter === 'suspended' && !user.isActive);
    
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=\"mb-8\"
        >
          <h1 className=\"text-4xl font-bold text-white mb-4\">User Management</h1>
          <p className=\"text-gray-300\">Manage user accounts and monitor activities</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=\"mb-6\"
        >
          <div className=\"flex flex-col sm:flex-row gap-4\">
            <div className=\"flex gap-2\">
              {['all', 'active', 'suspended'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize ${
                    filter === status 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <div className=\"flex-1 max-w-md\">
              <input
                type=\"text\"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder=\"Search users by name or email...\"
                className=\"w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500\"
              />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=\"glass-card p-6 rounded-2xl border border-white/20\"
        >
          {loading ? (
            <div className=\"flex items-center justify-center py-12\">
              <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-white\"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className=\"text-center py-12\">
              <p className=\"text-gray-400\">No users found matching your criteria.</p>
            </div>
          ) : (
            <div className=\"overflow-x-auto\">
              <table className=\"w-full\">
                <thead>
                  <tr className=\"border-b border-white/10\">
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">User</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Status</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Deposits</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Investments</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Earnings</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Joined</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className=\"border-b border-white/5 hover:bg-white/5\">
                      <td className=\"py-4 px-4\">
                        <div className=\"flex items-center gap-3\">
                          <div className=\"w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center\">
                            <span className=\"text-white font-medium text-sm\">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className=\"text-white font-medium\">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className=\"text-gray-400 text-sm\">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.isActive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                        }`}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-white font-medium\">
                          ${user.totalDeposits.toLocaleString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-blue-400 font-medium\">
                          {user.activeInvestments}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-green-400 font-medium\">
                          ${user.totalEarnings.toLocaleString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-gray-300\">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <button className=\"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors\">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}"