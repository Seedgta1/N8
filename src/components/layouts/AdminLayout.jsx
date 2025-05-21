
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, LogOut, ShieldAlert, CreditCard, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/admin/login');
    }
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/payments", label: "Pagamenti", icon: CreditCard },
    // { path: "/admin/users", label: "Utenti", icon: Users }, // Example for future
    // { path: "/admin/settings", label: "Impostazioni", icon: Settings }, // Example for future
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <header className="bg-slate-800/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 p-4 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/admin/dashboard" className="flex items-center text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            <ShieldAlert className="mr-3 h-8 w-8" />
            Admin Panel
          </Link>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-slate-400 hidden sm:block">Ciao, {user.email}</span>}
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto flex flex-col md:flex-row">
        <nav className="md:w-64 bg-slate-800 p-4 md:p-6 border-r border-slate-700 space-y-2 md:sticky md:top-[73px] md:h-[calc(100vh-73px)] overflow-y-auto">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                ${location.pathname === item.path 
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-purple-300 hover:pl-4'
                }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-grow p-4 md:p-8">
           <motion.div
              key={location.pathname} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
        </main>
      </div>
      
    </div>
  );
};

export default AdminLayout;
