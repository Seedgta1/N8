
import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, AlertTriangle, Zap, ExternalLink, Mail, FileText, Loader2, Lock, ArrowRightCircle, HelpCircle } from 'lucide-react';
import SitePreview from '@/components/SitePreview';
import SuggestedFixes from '@/components/SuggestedFixes';
import DetailedReport from '@/components/DetailedReport';
import EmailPreviewModal from '@/components/EmailPreviewModal';
import ScriptDisplayModal from '@/components/ScriptDisplayModal'; 
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ScanResults = ({ result }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [isFetchingScript, setIsFetchingScript] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (isAuthenticated && user) {
        setLoadingSubscription(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('is_subscribed')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') throw error; 
          
          setIsUserSubscribed(data?.is_subscribed || false);
        } catch (error) {
          console.error("Errore nel controllo abbonamento per script:", error);
          setIsUserSubscribed(false);
        } finally {
          setLoadingSubscription(false);
        }
      } else {
        setIsUserSubscribed(false);
        setLoadingSubscription(false);
      }
    };
    checkSubscriptionStatus();
  }, [isAuthenticated, user]);


  if (!result) return null;

  const handleOpenEmailModal = () => {
    if (result.is_compliant) {
         toast({
            title: "Sito Conforme",
            description: "Il sito analizzato risulta conforme. Non è necessario inviare un'email promozionale.",
            className: "bg-green-500/10 text-green-300 border-green-500/40"
        });
        return;
    }
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (emailAddress) => {
     toast({
        title: "Email (Simulata) Inviata",
        description: `Un'email di riepilogo è stata "inviata" a ${emailAddress} per il sito ${result.url}.`,
        className: "bg-blue-500/10 text-blue-300 border-blue-500/40"
      });
    setIsEmailModalOpen(false);
  };

  const handleGetCorrectionScript = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Accesso Richiesto",
        description: "Devi effettuare il login per ottenere lo script di correzione.",
        action: <Button onClick={() => navigate('/login')} variant="outline" size="sm">Accedi</Button>
      });
      return;
    }

    if (loadingSubscription) {
        toast({ title: "Verifica in corso", description: "Controllo stato abbonamento..."});
        return;
    }
    
    if (!isUserSubscribed) {
        toast({
            variant: "destructive",
            title: "Abbonamento Richiesto",
            description: "Questa funzionalità richiede un abbonamento attivo.",
            action: <Button onClick={() => navigate(user && user.email === "admin@example.com" ? '/admin/payments' : '/payments')} variant="outline" size="sm">Abbonati</Button>
        });
        return;
    }


    setIsFetchingScript(true);
    setScriptContent('');

    try {
      const { data, error } = await supabase.functions.invoke('get-correction-script', {
        body: JSON.stringify({ issues: result.suggestions, siteUrl: result.url }),
      });

      if (error) throw error;

      if (data && data.script) {
        setScriptContent(data.script);
        setIsScriptModalOpen(true);
      } else {
        throw new Error("Risposta della funzione non valida o script mancante.");
      }

    } catch (error) {
      console.error("Errore chiamata Edge Function 'get-correction-script':", error);
      toast({
        variant: "destructive",
        title: "Errore Generazione Script",
        description: error.message || "Impossibile generare lo script di correzione. Riprova.",
      });
    } finally {
      setIsFetchingScript(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mt-8" 
    >
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700 shadow-2xl shadow-purple-500/10">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl flex items-center text-slate-100">
            {result.is_compliant ? (
              <ShieldCheck className="mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
            ) : (
              <AlertTriangle className="mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
            )}
            Report Conformità GDPR
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm sm:text-base">
            Sito analizzato: <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline truncate max-w-[200px] md:max-w-xs lg:max-w-md inline-block align-middle">{result.url} <ExternalLink size={14} className="inline ml-1" /></a>
            <br />
            Scansione effettuata il: {result.scan_date_locale || new Date(result.scan_date_raw).toLocaleString('it-IT')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-4 sm:p-6 md:p-8">
          {result.is_compliant ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-green-500/10 border-2 border-green-500/40 rounded-xl text-green-300 text-center"
            >
              <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-green-400" />
              <p className="font-semibold text-xl sm:text-2xl mb-2">Congratulazioni!</p>
              <p className="text-md sm:text-lg">Il tuo sito sembra essere conforme al GDPR.</p>
              <p className="text-xs sm:text-sm mt-1">Nessun problema critico rilevato durante questa analisi simulata.</p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 sm:p-6 bg-red-500/10 border-2 border-red-500/40 rounded-xl text-red-300 mb-8 text-center"
              >
                <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-red-400" />
                <p className="font-semibold text-xl sm:text-2xl mb-2">Attenzione!</p>
                <p className="text-md sm:text-lg">Sono stati rilevati {result.issues_count} potenziali problemi di conformità GDPR.</p>
              </motion.div>
              
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <SitePreview siteUrl={result.url} issues={result.suggestions} />
                <SuggestedFixes suggestions={result.suggestions} />
              </div>
              
              <DetailedReport issues={result.suggestions} />

              <div className="mt-8 pt-6 border-t border-slate-700">
                <h4 className="text-xl font-semibold mb-4 text-slate-100 flex items-center">
                    <ArrowRightCircle className="mr-2 text-purple-400 h-6 w-6"/> Prossimi Passi Consigliati
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside pl-2">
                    <li>Analizza attentamente i problemi evidenziati nel report dettagliato.</li>
                    <li>Discuti i risultati con il tuo team di sviluppo o un consulente tecnico.</li>
                    <li>Considera di consultare un esperto legale specializzato in GDPR per una valutazione completa.</li>
                    <li>Utilizza lo script di correzione (se abbonato) come punto di partenza, ma verifica sempre le modifiche prima di applicarle in produzione.</li>
                    <li>Ricorda che la conformità GDPR è un processo continuo. Riesamina periodicamente il tuo sito.</li>
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (result.suggestions?.length || 0) * 0.1 + 0.5 }} 
                className="pt-8 mt-8 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
              >
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 text-md sm:text-lg rounded-lg shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 ease-in-out transform hover:scale-102"
                  onClick={handleOpenEmailModal}
                >
                  <Mail className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6" />
                  Prepara Email Offerta
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 text-md sm:text-lg rounded-lg shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 ease-in-out transform hover:scale-102 disabled:opacity-70"
                  onClick={handleGetCorrectionScript}
                  disabled={isFetchingScript || loadingSubscription}
                >
                  {isFetchingScript ? <Loader2 className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 animate-spin" /> : (isUserSubscribed ? <FileText className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6" /> : <Lock className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-5 sm:w-5" />)}
                  {isFetchingScript ? 'Generazione...' : (loadingSubscription ? 'Verifica...' : (isUserSubscribed ? 'Ottieni Script' : 'Sblocca Script'))}
                </Button>
              </motion.div>
               <p className="text-xs sm:text-sm text-center mt-2 text-slate-500">
                {!isAuthenticated ? "Accedi per visualizzare lo stato dell'abbonamento e ottenere lo script." :
                 (loadingSubscription ? "Verifica dello stato dell'abbonamento in corso..." : 
                  (isUserSubscribed ? "Grazie per il tuo abbonamento! Lo script di correzione è disponibile." : "Lo script di correzione è una funzionalità premium. Richiede un abbonamento attivo."))}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      {isEmailModalOpen && !result.is_compliant && (
        <EmailPreviewModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          scanResult={result}
          onSendEmail={handleSendEmail}
        />
      )}
      {isScriptModalOpen && (
        <ScriptDisplayModal
          isOpen={isScriptModalOpen}
          onClose={() => setIsScriptModalOpen(false)}
          scriptContent={scriptContent}
          siteUrl={result.url}
        />
      )}
    </motion.div>
  );
};

export default ScanResults;
