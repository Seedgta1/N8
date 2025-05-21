
import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, LogIn, UserPlus, LayoutDashboard as LayoutDashboardIcon, LogOut as LogOutIcon, CreditCard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const SiteLayout = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navItemClass = "transition-colors hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium flex items-center";
  const activeNavItemClass = "text-purple-400 bg-purple-500/10";

  const navLinks = [
    { path: "/", label: "Scanner GDPR", icon: Zap, requiresAuth: false, hideWhenAuth: false },
    { path: "/dashboard", label: "Dashboard Utente", icon: LayoutDashboardIcon, requiresAuth: true, adminOnly: false, hideWhenNotAuth: true },
    { path: "/payments", label: "Abbonamento", icon: CreditCard, requiresAuth: true, adminOnly: false, hideWhenNotAuth: true },
  ];

  const renderNavLinks = (isMobile = false) => navLinks.map(link => {
    if (link.requiresAuth && !isAuthenticated) return null;
    if (link.hideWhenAuth && isAuthenticated) return null;
    if (link.hideWhenNotAuth && !isAuthenticated) return null;
    if (link.adminOnly && (!isAuthenticated || !isAdmin)) return null;
    if (isAuthenticated && isAdmin && (link.path === "/dashboard" || link.path === "/payments")) return null;

    return (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={({ isActive }) => `${navItemClass} ${isMobile ? 'w-full justify-start text-base py-3' : ''} ${isActive ? activeNavItemClass : 'text-slate-300'}`}
      >
        <link.icon className="mr-2 h-5 w-5" /> {link.label}
      </NavLink>
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
      <motion.header 
        className="bg-slate-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-slate-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center text-xl sm:text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
              <ShieldCheck className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8" />
              <span>GDPR Scan</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {renderNavLinks()}
            </nav>
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-xs lg:text-sm text-slate-400 hidden sm:block">
                    {isAdmin ? `Admin: ${user.email.split('@')[0]}` : `Utente: ${user.email.split('@')[0]}`}
                  </span>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center">
                    <LogOutIcon className="mr-1.5 h-4 w-4 lg:mr-2 lg:h-5 lg:w-5" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center">
                    <Link to="/login"><LogIn className="mr-1.5 h-4 w-4 lg:mr-2 lg:h-5 lg:w-5" /> Accedi</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold hidden sm:flex items-center">
                    <Link to="/signup"><UserPlus className="mr-1.5 h-4 w-4 lg:mr-2 lg:h-5 lg:w-5" /> Registrati</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-purple-300">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-slate-800 border-b border-slate-700 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-1 px-2 py-3">
              {renderNavLinks(true)}
              <div className="pt-4 mt-2 border-t border-slate-700">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-slate-400">
                      {isAdmin ? `Admin: ${user.email.split('@')[0]}` : `Utente: ${user.email.split('@')[0]}`}
                    </div>
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-slate-300 hover:text-red-400 hover:bg-red-500/10 flex items-center text-base py-3">
                      <LogOutIcon className="mr-2 h-5 w-5" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 flex items-center text-base py-3">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><LogIn className="mr-2 h-5 w-5" /> Accedi</Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold flex items-center text-base py-3 mt-1">
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}><UserPlus className="mr-2 h-5 w-5" /> Registrati</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="bg-slate-800/50 border-t border-slate-700 py-6 text-center">
        <p className="text-xs sm:text-sm text-slate-400">&copy; {new Date().getFullYear()} GDPR Scan. Tutti i diritti riservati.</p>
        <p className="text-xs text-slate-500 mt-1">Questo strumento è a scopo dimostrativo e non fornisce consulenza legale.</p>
      </footer>
    </div>
  );
};

export default SiteLayout;
