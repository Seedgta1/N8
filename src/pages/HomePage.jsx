
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScanForm from '@/components/ScanForm';
import ScanResults from '@/components/ScanResults';
import { useToast } from "@/components/ui/use-toast";
import { getDeterministicIssues } from '@/lib/scanLogic';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext'; 
import { v4 as uuidv4 } from 'uuid';

const ALL_POSSIBLE_ISSUES = [
  { id: 'cookie_consent', text: "Manca un banner di consenso per i cookie adeguato.", description: "Il sito non presenta un meccanismo chiaro e conforme per ottenere il consenso degli utenti prima di installare cookie non essenziali.", category: "Cookie e Tracciamento", criticality: "Alta", solution_type: "Implementazione Banner", fine_amount_eur: 20000, gdpr_article: "Art. 7, Art. 13", norm_title: "Consenso Cookie e Informativa" },
  { id: 'privacy_policy_link', text: "Link all'informativa sulla privacy non facilmente accessibile.", description: "L'informativa sulla privacy dovrebbe essere raggiungibile da ogni pagina del sito, solitamente tramite un link nel footer.", category: "Informativa Privacy", criticality: "Media", solution_type: "Aggiornamento Link", fine_amount_eur: 10000, gdpr_article: "Art. 12, Art. 13", norm_title: "Accessibilità Informativa Privacy" },
  { id: 'data_collection_forms', text: "I moduli di raccolta dati non specificano l'uso dei dati.", description: "Ogni modulo (contatti, newsletter, ecc.) deve chiarire per quali finalità i dati verranno trattati e linkare all'informativa completa.", category: "Raccolta Dati e Consenso", criticality: "Alta", solution_type: "Revisione Moduli", fine_amount_eur: 15000, gdpr_article: "Art. 5, Art. 13", norm_title: "Finalità Trattamento e Informativa Moduli" },
  { id: 'ssl_certificate', text: "Il sito non utilizza HTTPS (certificato SSL).", description: "La comunicazione tra l'utente e il sito deve essere crittografata per proteggere i dati trasmessi. L'assenza di HTTPS è una grave lacuna di sicurezza.", category: "Sicurezza dei Dati", criticality: "Alta", solution_type: "Installazione SSL", fine_amount_eur: 25000, gdpr_article: "Art. 32", norm_title: "Sicurezza del Trattamento (HTTPS)" },
  { id: 'data_retention_policy', text: "Manca una chiara politica sulla conservazione dei dati.", description: "L'informativa privacy dovrebbe specificare per quanto tempo i dati personali vengono conservati prima di essere anonimizzati o cancellati.", category: "Informativa Privacy", criticality: "Media", solution_type: "Aggiornamento Policy", fine_amount_eur: 5000, gdpr_article: "Art. 5, Art. 13", norm_title: "Periodo Conservazione Dati" },
  { id: 'third_party_cookies', text: "Uso non trasparente di cookie di terze parti.", description: "Se il sito utilizza cookie di terze parti (es. per analytics, pubblicità), questi devono essere elencati nell'informativa cookie e, se non essenziali, bloccati prima del consenso.", category: "Cookie e Tracciamento", criticality: "Media", solution_type: "Revisione Cookie Policy", fine_amount_eur: 12000, gdpr_article: "Art. 13, Art. 28", norm_title: "Trasparenza Cookie Terze Parti" },
  { id: 'user_rights_info', text: "Informazioni incomplete sui diritti degli utenti (es. accesso, cancellazione).", description: "L'informativa privacy deve spiegare chiaramente come gli utenti possono esercitare i loro diritti GDPR (accesso, rettifica, cancellazione, portabilità, ecc.).", category: "Diritti degli Interessati", criticality: "Media", solution_type: "Aggiornamento Policy", fine_amount_eur: 8000, gdpr_article: "Art. 15-22", norm_title: "Esercizio Diritti Interessati" },
  { id: 'cookie_policy_details', text: "L'informativa sui cookie è troppo generica o incompleta.", description: "L'informativa cookie deve dettagliare specificamente quali cookie sono usati, la loro finalità, durata e come disattivarli.", category: "Cookie e Tracciamento", criticality: "Media", solution_type: "Revisione Cookie Policy", fine_amount_eur: 7500, gdpr_article: "Art. 13", norm_title: "Dettaglio Informativa Cookie" },
  { id: 'dpo_contact_missing', text: "Mancano i dettagli di contatto del DPO (se applicabile).", description: "Se l'organizzazione ha nominato un Data Protection Officer, i suoi contatti devono essere facilmente reperibili nell'informativa privacy.", category: "Trasparenza Aziendale", criticality: "Bassa", solution_type: "Aggiornamento Policy", fine_amount_eur: 3000, gdpr_article: "Art. 37-39", norm_title: "Contatti DPO" },
  { id: 'data_breach_procedure', text: "Nessuna menzione delle procedure in caso di data breach.", description: "Anche se non strettamente obbligatorio per tutte le informative, è buona prassi indicare come l'organizzazione gestisce le violazioni dei dati.", category: "Sicurezza dei Dati", criticality: "Bassa", solution_type: "Aggiornamento Policy", fine_amount_eur: 4000, gdpr_article: "Art. 33, Art. 34", norm_title: "Gestione Data Breach" }
];


const HomePage = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
    }
  }, []);

  const normalizeUrl = (inputUrl) => {
    let normalized = inputUrl.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }
    try {
      const urlObject = new URL(normalized);
      return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname === '/' ? '' : urlObject.pathname}`;
    } catch (error) {
      return null; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setScanResult(null);

    const currentUrl = window.location.origin;
    if (url.includes(currentUrl.split('//')[1])) {
      toast({
        variant: "destructive",
        title: "Scansione non permessa",
        description: "Non puoi scansionare l'URL di questa stessa applicazione.",
      });
      setIsLoading(false);
      return;
    }

    const normalizedScanUrl = normalizeUrl(url);
    if (!normalizedScanUrl) {
      toast({
        variant: "destructive",
        title: "URL Invalido",
        description: "L'URL inserito non è valido. Assicurati che includa il protocollo (es. https://) e un nome dominio corretto.",
      });
      setIsLoading(false);
      return;
    }


    const issues = getDeterministicIssues(normalizedScanUrl, ALL_POSSIBLE_ISSUES);
    const isCompliant = issues.length === 0;
    const issuesCount = issues.length;
    const scanDateRaw = new Date();
    const scanDateLocale = scanDateRaw.toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' });
    
    const resultData = {
      id: uuidv4(),
      url: normalizedScanUrl,
      is_compliant: isCompliant,
      issues_count: issuesCount,
      suggestions: issues,
      scan_date_raw: scanDateRaw.toISOString(),
      scan_date_locale: scanDateLocale,
      user_id: isAuthenticated && user ? user.id : null,
    };

    try {
      const { error: dbError } = await supabase
        .from('scans')
        .insert([resultData]);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Scansione Completata e Salvata",
        description: `Analisi per ${normalizedScanUrl} terminata. Risultati salvati nel database.`,
        className: "bg-green-500/10 text-green-300 border-green-500/40"
      });

    } catch (error) {
      console.error('Error saving scan to Supabase:', error);
      toast({
        variant: "destructive",
        title: "Errore Salvataggio Scansione",
        description: `Impossibile salvare i risultati nel database. ${error.message}. I risultati sono comunque visibili.`,
      });
    }
    
    setScanResult(resultData);
    setIsLoading(false);
  };

  return (
    <motion.div 
      className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-start pt-8 md:pt-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/50 text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ScanForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} isLoading={isLoading} />
      <ScanResults result={scanResult} />
    </motion.div>
  );
};

export default HomePage;
