
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopy, Download } from 'lucide-react';

const ScriptDisplayModal = ({ isOpen, onClose, scriptContent, siteUrl }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent)
      .then(() => {
        toast({ title: "Script Copiato!", description: "Lo script è stato copiato negli appunti." });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Errore Copia", description: "Impossibile copiare lo script." });
        console.error('Failed to copy script: ', err);
      });
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeSiteUrl = siteUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.href = url;
    link.setAttribute('download', `gdpr_correction_script_${safeSiteUrl}.js`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Download Avviato", description: "Lo script di correzione è in download." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-slate-800 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-400">Script di Correzione (Simulato)</DialogTitle>
          <DialogDescription className="text-slate-400">
            Questo è uno script generato automaticamente per il sito: <span className="font-semibold text-purple-300">{siteUrl}</span>.
            <br />
            <strong className="text-yellow-400">Attenzione:</strong> Usare con cautela e dopo attenta revisione.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh] max-h-[600px] w-full rounded-md border border-slate-600 bg-slate-900 p-4 my-4">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap break-all">
            <code>{scriptContent}</code>
          </pre>
        </ScrollArea>

        <DialogFooter className="sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="border-purple-500/70 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
              <ClipboardCopy className="mr-2 h-4 w-4" /> Copia Script
            </Button>
            <Button variant="outline" onClick={handleDownload} className="border-green-500/70 text-green-300 hover:bg-green-500/20 hover:text-green-200">
              <Download className="mr-2 h-4 w-4" /> Scarica Script
            </Button>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-slate-400 hover:bg-slate-700 hover:text-slate-200">Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptDisplayModal;
