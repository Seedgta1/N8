
import React from 'react';
import UserScansList from '@/components/dashboard/UserScansList';
import UserSubscriptionPanel from '@/components/dashboard/UserSubscriptionPanel';
import UserScriptsAccess from '@/components/dashboard/UserScriptsAccess';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 flex items-center">
          <LayoutDashboard className="mr-3 sm:mr-4 h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
          La Mia Dashboard
        </h1>
        {user && <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">Benvenuto, {user.email}. Qui puoi gestire le tue scansioni e il tuo abbonamento.</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <UserScansList />
        </div>
        <div className="lg:col-span-1 space-y-6 sm:space-y-8">
          <UserSubscriptionPanel />
          <UserScriptsAccess />
        </div>
      </div>
      
    </motion.div>
  );
};

export default UserDashboardPage;
