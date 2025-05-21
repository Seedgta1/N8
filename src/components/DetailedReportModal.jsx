
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DetailedReport from '@/components/DetailedReport'; 
import { X, ExternalLink } from 'lucide-react';

const DetailedReportModal = ({ isOpen, onClose, scanResult }) => {
  if (!scanResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-slate-800 border-slate-700 text-slate-100 shadow-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-400">
            Report Dettagliato per: <a href={scanResult.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{scanResult.url} <ExternalLink size={16} className="inline ml-1" /></a>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Scansione del: {scanResult.scanDate}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <DetailedReport issues={scanResult.suggestions} />
        </div>

        <DialogFooter className="mt-4 sm:justify-end">
           <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <X className="mr-2 h-4 w-4" /> Chiudi Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedReportModal;
