
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, Info, Search, FileText } from 'lucide-react';
import DetailedReportModal from '@/components/DetailedReportModal';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const UserScansList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScanForReport, setSelectedScanForReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserScans = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('scan_date_raw', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle scansioni utente:", error);
      toast({
        variant: "destructive",
        title: "Errore Caricamento Scansioni",
        description: "Impossibile caricare le tue scansioni personali."
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUserScans();
  }, [fetchUserScans]);

  const handleDeleteScan = async (scanId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa scansione?")) return;
    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .match({ id: scanId, user_id: user.id });
      
      if (error) throw error;
      setScans(prevScans => prevScans.filter(s => s.id !== scanId));
      toast({ title: "Scansione Eliminata", description: "La scansione è stata rimossa." });
    } catch (error) {
      console.error("Errore eliminazione scansione:", error);
      toast({ variant: "destructive", title: "Errore Eliminazione", description: "Impossibile eliminare la scansione." });
    }
  };

  const filteredScans = scans.filter(scan => 
    scan.url.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
        <p className="ml-3 text-slate-300">Caricamento delle tue scansioni...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-lg"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-slate-100 flex items-center">
          <FileText className="mr-2 h-6 w-6 text-purple-400"/> Le Mie Scansioni GDPR
        </h3>
         <div className="relative w-full sm:max-w-xs">
            <Input
            type="text"
            placeholder="Cerca URL scansionato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 pl-10 h-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>
      
      {filteredScans.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-700/30 rounded-lg">
          <Info className="mx-auto h-12 w-12 text-slate-500 mb-3" />
          <p className="text-slate-400">
            {scans.length === 0 ? "Non hai ancora eseguito nessuna scansione." : "Nessuna scansione trovata per il termine di ricerca."}
          </p>
          {scans.length === 0 && 
            <Button asChild size="lg" className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Link to="/">Esegui la Tua Prima Scansione</Link>
            </Button>
          }
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-700/30 border-b-slate-700">
                <TableHead className="text-slate-300 font-semibold">URL</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">Data</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">Stato</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">Problemi</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map(scan => (
                <TableRow key={scan.id} className="border-b-slate-700 hover:bg-slate-700/50 transition-colors">
                  <TableCell className="font-medium text-purple-300 truncate max-w-[150px] sm:max-w-xs">
                    <a href={scan.url} target="_blank" rel="noopener noreferrer" title={scan.url} className="hover:underline">{scan.url}</a>
                  </TableCell>
                  <TableCell className="text-slate-400 text-center text-xs">{scan.scan_date_locale}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      scan.is_compliant ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {scan.is_compliant ? 'Conforme' : 'Non Conforme'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-center">{scan.issues_count}</TableCell>
                  <TableCell className="text-right space-x-1.5">
                    <Button variant="outline" size="icon" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 h-8 w-8" onClick={() => setSelectedScanForReport(scan)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Vedi Report</span>
                    </Button>
                    <Button variant="outline" size="icon" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 w-8" onClick={() => handleDeleteScan(scan.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Elimina</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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

export default UserScansList;
