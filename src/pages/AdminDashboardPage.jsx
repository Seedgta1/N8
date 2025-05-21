
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/components/ui/use-toast";
import { Mail, Search, Trash2, Eye, Send, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import EmailPreviewModal from '@/components/EmailPreviewModal'; 
import DetailedReportModal from '@/components/DetailedReportModal';
import { supabase } from '@/lib/supabaseClient';

const AdminDashboardPage = () => {
  const [scans, setScans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScanForEmail, setSelectedScanForEmail] = useState(null);
  const [selectedScanForReport, setSelectedScanForReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchScans = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('scan_date_raw', { ascending: false });

    if (error) {
      console.error('Error fetching scans from Supabase:', error);
      toast({
        variant: "destructive",
        title: "Errore Caricamento Scansioni",
        description: "Impossibile caricare lo storico delle scansioni. " + error.message,
      });
      setScans([]);
    } else {
      setScans(data || []);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const handleSendEmail = (scan) => {
    if (scan.is_compliant) {
      toast({
        title: "Sito Conforme",
        description: "Non è necessario inviare un'email per siti conformi.",
      });
      return;
    }
    setSelectedScanForEmail(scan);
  };
  
  const handleViewReport = (scan) => {
    setSelectedScanForReport(scan);
  };

  const handleActualSendEmail = (emailAddress) => {
     toast({
        title: "Email (Simulata) Inviata",
        description: `Un'email di riepilogo è stata "inviata" a ${emailAddress} per il sito ${selectedScanForEmail.url}.`,
        className: "bg-blue-500/10 text-blue-300 border-blue-500/40"
      });
    setSelectedScanForEmail(null); 
  };

  const handleDeleteScan = async (scanId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa scansione?")) return;

    const { error } = await supabase
      .from('scans')
      .delete()
      .match({ id: scanId });

    if (error) {
      console.error('Error deleting scan from Supabase:', error);
      toast({
        variant: "destructive",
        title: "Errore Eliminazione",
        description: "Impossibile eliminare la scansione. " + error.message,
      });
    } else {
      setScans(prevScans => prevScans.filter(scan => scan.id !== scanId));
      toast({
        title: "Scansione Eliminata",
        description: "La scansione selezionata è stata rimossa dal database.",
        className: "bg-red-500/10 text-red-300 border-red-500/40"
      });
    }
  };
  
  const handleDeleteAllScans = async () => {
    if (window.confirm("Sei sicuro di voler eliminare TUTTE le scansioni? Questa azione è irreversibile e cancellerà tutti i record dal database.")) {
      
      const { error } = await supabase
        .from('scans')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); 

      if (error) {
        console.error('Error deleting all scans from Supabase:', error);
        toast({
          variant: "destructive",
          title: "Errore Eliminazione Totale",
          description: "Impossibile eliminare tutte le scansioni. " + error.message,
        });
      } else {
        setScans([]);
        toast({
          title: "Tutte le Scansioni Eliminate",
          description: "Lo storico delle scansioni è stato cancellato dal database.",
          className: "bg-red-500/10 text-red-300 border-red-500/40"
        });
      }
    }
  };

  const filteredScans = scans.filter(scan => 
    scan.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-100">Dashboard Scansioni GDPR</CardTitle>
          <CardDescription className="text-slate-400">Visualizza e gestisci tutte le scansioni GDPR effettuate (dati da Supabase).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Input
                type="text"
                placeholder="Cerca URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchScans} variant="outline" size="sm" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Aggiorna
              </Button>
              {scans.length > 0 && (
                   <Button onClick={handleDeleteAllScans} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Elimina Tutte
                  </Button>
              )}
            </div>
          </div>

          {isLoading && filteredScans.length === 0 ? (
             <div className="text-center text-slate-400 py-8">
                <Loader2 className="mx-auto h-12 w-12 text-purple-400 animate-spin mb-4" />
                <p>Caricamento scansioni da Supabase...</p>
            </div>
          ) : filteredScans.length === 0 ? (
            <p className="text-center text-slate-400 py-8">
              {scans.length === 0 ? "Nessuna scansione trovata nel database. Effettua una scansione dalla homepage." : "Nessuna scansione corrisponde alla tua ricerca."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-700/30 border-b-slate-700">
                    <TableHead className="text-slate-300 font-semibold">URL Sito</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">Data Scansione</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">Stato</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">Problemi</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScans.map((scan) => (
                    <TableRow key={scan.id} className="border-b-slate-700 hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium text-purple-300 truncate max-w-[200px] sm:max-w-xs">
                        <a href={scan.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{scan.url}</a>
                      </TableCell>
                      <TableCell className="text-slate-400 text-center">{scan.scan_date_locale}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          scan.is_compliant 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {scan.is_compliant ? 'Conforme' : 'Non Conforme'}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400 text-center">{scan.issues_count}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300" onClick={() => handleViewReport(scan)}>
                          <Eye className="h-4 w-4" />
                           <span className="sr-only">Visualizza Report</span>
                        </Button>
                        {!scan.is_compliant && (
                          <Button variant="outline" size="icon" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300" onClick={() => handleSendEmail(scan)}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Invia Email (Simulato)</span>
                          </Button>
                        )}
                        <Button variant="outline" size="icon" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleDeleteScan(scan.id)}>
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Elimina Scansione</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedScanForEmail && (
        <EmailPreviewModal
          isOpen={!!selectedScanForEmail}
          onClose={() => setSelectedScanForEmail(null)}
          scanResult={{...selectedScanForEmail, suggestions: selectedScanForEmail.suggestions || []}}
          onSendEmail={handleActualSendEmail}
        />
      )}
      {selectedScanForReport && (
        <DetailedReportModal
            isOpen={!!selectedScanForReport}
            onClose={() => setSelectedScanForReport(null)}
            scanResult={{...selectedScanForReport, suggestions: selectedScanForReport.suggestions || []}}
        />
      )}
    </motion.div>
  );
};

const Input = ({ className, ...props }) => (
  <input {...props} className={`h-10 px-3 py-2 text-sm rounded-md w-full ${className}`} />
);

export default AdminDashboardPage;
