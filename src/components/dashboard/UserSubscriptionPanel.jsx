
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const UserSubscriptionPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_subscribed')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116: no rows found, ok
        setIsSubscribed(data?.is_subscribed || false);
      } catch (error) {
        console.error("Errore nel controllo abbonamento:", error);
        // Non mostrare toast di errore qui, potrebbe essere normale se il profilo non esiste ancora
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSubscription();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        <p className="ml-3 text-slate-300">Verifica stato abbonamento...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
        <CreditCard className="mr-2 h-6 w-6 text-purple-400"/> Stato Abbonamento
      </h3>
      {isSubscribed ? (
        <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 flex items-start">
          <CheckCircle className="h-8 w-8 mr-3 mt-1 text-green-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-lg">Abbonamento Attivo</h4>
            <p className="text-sm">Hai accesso a tutte le funzionalità premium, inclusi gli script di correzione dettagliati per le tue scansioni.</p>
            <Button asChild variant="link" className="text-purple-300 hover:text-purple-200 p-0 h-auto mt-2 text-sm">
              <Link to="/payments">Gestisci Abbonamento</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 flex items-start">
          <AlertCircle className="h-8 w-8 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-lg">Nessun Abbonamento Attivo</h4>
            <p className="text-sm">Passa a Pro per sbloccare gli script di correzione personalizzati e supportare lo sviluppo di questo strumento.</p>
            <Button asChild size="lg" className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
              <Link to="/payments">
                <ShieldCheck className="mr-2 h-5 w-5"/> Abbonati Ora
              </Link>
            </Button>
          </div>
        </div>
      )}
       <p className="text-xs text-slate-500 mt-4 text-center">
        La gestione dell'abbonamento e i pagamenti sono processati tramite Stripe.
      </p>
    </motion.div>
  );
};

export default UserSubscriptionPanel;
