
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import ScriptDisplayModal from '@/components/ScriptDisplayModal';
import { Code2, Download, Loader2, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserScriptsAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscribedScans, setSubscribedScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [selectedScanForScript, setSelectedScanForScript] = useState(null);
  const [scriptContent, setScriptContent] = useState('');
  const [isFetchingScript, setIsFetchingScript] = useState(false);

  const fetchSubscribedScans = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Prima controlla se l'utente è abbonato
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('is_subscribed')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      const subscribed = profileData?.is_subscribed || false;
      setIsUserSubscribed(subscribed);

      if (subscribed) {
        const { data: scanData, error: scanError } = await supabase
          .from('scans')
          .select('*')
          .eq('user_id', user.id)
          .filter('is_compliant', 'eq', false) // Solo scansioni non conformi hanno script
          .order('scan_date_raw', { ascending: false });
        
        if (scanError) throw scanError;
        setSubscribedScans(scanData || []);
      } else {
        setSubscribedScans([]);
      }
    } catch (error) {
      console.error("Errore nel caricamento dati per script:", error);
      toast({ variant: "destructive", title: "Errore Caricamento", description: "Impossibile caricare i dati per gli script." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchSubscribedScans();
  }, [fetchSubscribedScans]);

  const handleGetScript = async (scan) => {
    if (!isUserSubscribed) {
        toast({ variant: "destructive", title: "Abbonamento Richiesto", description: "Devi essere abbonato per accedere agli script." });
        return;
    }
    setSelectedScanForScript(scan);
    setIsFetchingScript(true);
    setScriptContent('');
    try {
      const { data, error } = await supabase.functions.invoke('get-correction-script', {
        body: JSON.stringify({ issues: scan.suggestions, siteUrl: scan.url }),
      });
      if (error) throw error;
      if (data && data.script) {
        setScriptContent(data.script);
      } else {
        throw new Error("Risposta della funzione non valida.");
      }
    } catch (error) {
      console.error("Errore chiamata Edge Function per script:", error);
      toast({ variant: "destructive", title: "Errore Script", description: "Impossibile generare lo script." });
    } finally {
      setIsFetchingScript(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        <p className="ml-3 text-slate-300">Caricamento accesso script...</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
        <Code2 className="mr-2 h-6 w-6 text-purple-400"/> Script di Correzione Personalizzati
      </h3>

      {!isUserSubscribed ? (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300">
          <AlertTriangle className="h-8 w-8 mb-2 text-yellow-400" />
          <h4 className="font-semibold text-lg">Funzionalità Premium</h4>
          <p className="text-sm">L'accesso agli script di correzione personalizzati richiede un abbonamento attivo.</p>
          <Button asChild size="md" className="mt-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
            <Link to="/payments"><ShieldCheck className="mr-2 h-5 w-5"/> Abbonati Ora</Link>
          </Button>
        </div>
      ) : subscribedScans.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-700/30 rounded-lg">
            <Info className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <p className="text-slate-400">Nessuna scansione non conforme trovata per cui generare uno script.
            <br/>Oppure, non hai ancora eseguito scansioni.</p>
             <Button asChild size="lg" className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Link to="/">Esegui una Scansione</Link>
            </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {subscribedScans.map(scan => (
            <div key={scan.id} className="p-4 bg-slate-700/50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <p className="font-medium text-purple-300 truncate max-w-[200px] sm:max-w-md" title={scan.url}>{scan.url}</p>
                <p className="text-xs text-slate-400">Scansionato il: {scan.scan_date_locale}</p>
                <p className="text-xs text-red-400">{scan.issues_count} problemi rilevati</p>
              </div>
              <Button 
                onClick={() => handleGetScript(scan)} 
                disabled={isFetchingScript && selectedScanForScript?.id === scan.id}
                variant="outline"
                size="sm"
                className="border-teal-500/70 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 w-full sm:w-auto"
              >
                {isFetchingScript && selectedScanForScript?.id === scan.id ? 
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                  <Download className="mr-2 h-4 w-4" />
                }
                {isFetchingScript && selectedScanForScript?.id === scan.id ? 'Generazione...' : 'Ottieni Script'}
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {selectedScanForScript && scriptContent && !isFetchingScript && (
        <ScriptDisplayModal
          isOpen={!!selectedScanForScript && !!scriptContent && !isFetchingScript}
          onClose={() => { setSelectedScanForScript(null); setScriptContent(''); }}
          scriptContent={scriptContent}
          siteUrl={selectedScanForScript.url}
        />
      )}
       <p className="text-xs text-slate-500 mt-4 text-center">
        Gli script sono generati dinamicamente e mirano a risolvere i problemi rilevati. Usare con cautela.
      </p>
    </motion.div>
  );
};

export default UserScriptsAccess;
