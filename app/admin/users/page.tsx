"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuUsers, 
  LuSearch, 
  LuShieldCheck, 
  LuUser, 
  LuEllipsis, 
  LuWallet, 
  LuKey, 
  LuShieldOff, 
  LuX,
  LuLoaderCircle,
  LuCircleCheck,
  LuTriangleAlert,
  LuLayoutDashboard
} from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string;
  plan: string;
  created_at: string;
  email?: string;
  totp_enabled?: boolean;
}

interface UserBalance {
  asset_code: string;
  amount: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Management Modal State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
  const [isManaging, setIsManaging] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    async function checkAdminAndFetchUsers() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        
        // Fetch all users
        const { data: usersData } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        
        setUsers(usersData || []);
      } else {
        setIsAdmin(false);
        router.push("/dashboard");
      }
      setLoading(false);
    }

    checkAdminAndFetchUsers();
  }, [router]);

  const fetchUserBalances = async (userId: string) => {
    const { data } = await supabase.from("balances").select("asset_code, amount").eq("user_id", userId);
    setUserBalances(data || []);
  };

  const handleManageUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsManaging(true);
    setActionStatus(null);
    setNewPassword("");
    fetchUserBalances(user.id);
  };

  const performAdminAction = async (action: string, data?: any) => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    setActionStatus(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ action, userId: selectedUser.id, data })
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setActionStatus({ type: 'success', message: `${action === 'updatePassword' ? 'Password updated' : 'Security settings updated'} successfully!` });
      
      if (action === 'disable2FA') {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, totp_enabled: false } : u));
      }
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-50" />

      <AdminSidebar currentPath="/admin/users" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                User Management
                <LuUsers className="h-6 w-6 text-white/40" />
              </h1>
              <p className="text-white/40 font-medium">Manage platform users and their administrative roles.</p>
            </div>

            <div className="relative group max-w-md w-full">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/50 transition-colors" />
              <input 
                type="text"
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              />
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">User</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Plan</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Joined</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <LuUser className="h-5 w-5 text-white/40" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.full_name || "Unknown User"}</p>
                            <p className="text-xs text-white/30">@{user.username || "n/a"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-white/5 text-white/50 border border-white/10'
                        }`}>
                          {user.role === 'admin' && <LuShieldCheck className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-white/60 capitalize">{user.plan}</span>
                      </td>
                      <td className="px-8 py-6 text-sm text-white/40">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleManageUser(user)}
                          className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all active:scale-95"
                        >
                          <LuEllipsis className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-20 text-center">
                <LuUsers className="h-12 w-12 text-white/5 mx-auto mb-4" />
                <p className="text-white/40 font-medium">No users found matching your search.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Management Modal */}
      <AnimatePresence>
        {isManaging && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManaging(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-500/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <LuUser className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.full_name || "Account Manager"}</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">Administrative Controls</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsManaging(false)}
                  className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <LuX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Wallet Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <LuWallet className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Asset Overview</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {userBalances.length > 0 ? userBalances.map((bal) => (
                      <div key={bal.asset_code} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-emerald-500/20 transition-all">
                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1 tracking-wider">{bal.asset_code}</p>
                        <p className="text-sm font-bold text-white">{Number(bal.amount).toLocaleString()}</p>
                      </div>
                    )) : (
                      <div className="col-span-full py-8 text-center text-white/20 text-sm border border-dashed border-white/5 rounded-2xl italic">
                        No assets found in this wallet
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password Change */}
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <LuKey className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Reset Security</span>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                      />
                      <button 
                        disabled={!newPassword || isActionLoading}
                        onClick={() => performAdminAction('updatePassword', { password: newPassword })}
                        className="w-full py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                      >
                        {isActionLoading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : "Update Password"}
                      </button>
                    </div>
                  </div>

                  {/* 2FA Management */}
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <LuShieldOff className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Bypass Security</span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] text-white/30 leading-relaxed font-medium uppercase tracking-wider">
                        Instantly disable TOTP/2FA for this user account.
                      </p>
                      <button 
                        disabled={isActionLoading}
                        onClick={() => performAdminAction('disable2FA')}
                        className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {isActionLoading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : "Disable 2FA"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback Status */}
                {actionStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 border ${
                      actionStatus.type === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {actionStatus.type === 'success' ? <LuCircleCheck className="h-5 w-5" /> : <LuTriangleAlert className="h-5 w-5" />}
                    <p className="text-xs font-bold uppercase tracking-wider">{actionStatus.message}</p>
                  </motion.div>
                )}
              </div>

              <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setIsManaging(false)}
                  className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all"
                >
                  Exit Control Mode
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

