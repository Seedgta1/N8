
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import SiteLayout from '@/components/layouts/SiteLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import PaymentsPage from '@/pages/PaymentsPage';
import UserLoginPage from '@/pages/UserLoginPage';
import SignUpPage from '@/pages/SignUpPage';
import UserDashboardPage from '@/pages/UserDashboardPage';

function AdminRoute() {
  const { isAdminAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function UserRoute() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  // Se è admin, non dovrebbe accedere alle route utente "normali" come /dashboard, ma essere reindirizzato a /admin/dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return isAuthenticated && !isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
         {/* Pagina Pagamenti accessibile a tutti gli utenti loggati, non solo admin */}
        <Route path="/payments" element={
            <UserRouteGuardForPayments> 
                <PaymentsPage />
            </UserRouteGuardForPayments>
        } />
      </Route>
      
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/payments" element={<PaymentsPage />} /> 
          <Route path="/admin" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
      
      <Route element={<UserRoute />}>
        <Route element={<SiteLayout />}>
           <Route path="/dashboard" element={<UserDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Componente wrapper per proteggere /payments, permettendo accesso agli utenti loggati (non admin)
// e reindirizzando gli admin alla loro pagina pagamenti.
function UserRouteGuardForPayments({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // Se l'utente è un admin e tenta di accedere a /payments (per utenti normali), reindirizzalo a /admin/payments
    if (isAdmin) {
        return <Navigate to="/admin/payments" replace />
    }

    return children; 
}


export default AppRoutes;
