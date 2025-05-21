
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send, X, BookOpen } from 'lucide-react';

const EmailPreviewModal = ({ isOpen, onClose, scanResult, onSendEmail }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRecipientEmail('');
      setEmailError('');
    }
  }, [isOpen]);

  if (!scanResult || scanResult.isCompliant) return null;

  const { url, issuesCount, suggestions, scanDate } = scanResult;
  const totalPotentialFine = suggestions.reduce((sum, issue) => sum + (issue.fine_amount_eur || 0), 0);

  const emailSubject = `Report Conformità GDPR per ${url} - Azioni Urgenti Richieste`;

  const formatIssueForEmail = (issue) => {
    let issueString = `- ${issue.text}\n`;
    issueString += `  Criticità: ${issue.criticality}\n`;
    issueString += `  Norma Potenziale: ${issue.norm_title || 'N/D'} (${issue.gdpr_article || 'N/A'})\n`;
    issueString += `  Multa Stimata: € ${issue.fine_amount_eur.toLocaleString('it-IT')}\n`;
    return issueString;
  };

  const emailBody = `
Gentile Team di ${url},

Abbiamo effettuato una scansione preliminare di conformità GDPR del vostro sito web (${url}) in data ${scanDate} e sono emerse alcune criticità che richiedono la vostra attenzione.

**Riepilogo Scansione:**
- Sito Analizzato: ${url}
- Problemi Rilevati: ${issuesCount}
- Stima Multa Potenziale Totale: € ${totalPotentialFine.toLocaleString('it-IT')}

**Principali Problemi Riscontrati (con riferimenti normativi):**
${suggestions.slice(0, Math.min(3, suggestions.length)).map(formatIssueForEmail).join('\n')}
${issuesCount > 3 ? `\n...e altri ${issuesCount - 3} problemi dettagliati nel report completo che possiamo fornirvi.\n` : ''}
Queste non conformità potrebbero esporvi a significative sanzioni GDPR, oltre a minare la fiducia dei vostri utenti.

**La Nostra Soluzione:**
Il nostro team di esperti può aiutarvi a mettere in regola il vostro sito web in tempi brevi e con un approccio personalizzato. Offriamo un servizio di adeguamento GDPR completo con un **abbonamento mensile a partire da una tariffa minima e competitiva**. Il nostro pacchetto include:
- Analisi approfondita e report dettagliato con tutti i riferimenti normativi.
- Implementazione delle modifiche tecniche e legali necessarie (banner cookie, privacy policy aggiornata, gestione consensi, ecc.).
- Generazione di script e codice per l'adeguamento.
- Consulenza continua e supporto per gli aggiornamenti normativi.

**Non rischiate sanzioni!** Contattateci oggi stesso per una consulenza gratuita e un preventivo personalizzato.
Saremmo lieti di discutere come possiamo rendere il vostro sito ${url} pienamente conforme al GDPR.

Cordiali saluti,

Il Team di GDPR Compliance Solutions
[Il Tuo Numero di Telefono/Link al Tuo Sito]
  `;

  const handleSend = () => {
    if (!recipientEmail) {
      setEmailError("L'indirizzo email del destinatario è obbligatorio.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setEmailError("Inserisci un indirizzo email valido.");
      return;
    }
    setEmailError('');
    onSendEmail(recipientEmail);
  };
  
  const handleClose = () => {
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] bg-slate-800 border-slate-700 text-slate-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center text-purple-400">
            <AlertTriangle className="mr-3 h-7 w-7 text-red-400" />
            Anteprima Email Offerta Servizio GDPR
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Questa è un'anteprima dell'email che verrà (simulata) inviata per il sito ${url}.
            L'invio effettivo non avverrà in questo ambiente demo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
                <Label htmlFor="recipient-email" className="text-slate-300">Indirizzo Email Destinatario</Label>
                <Input 
                    id="recipient-email" 
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => { setRecipientEmail(e.target.value); setEmailError(''); }}
                    placeholder="es. contatto@esempio.com (da inserire manualmente)"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="email-subject" className="text-slate-300">Oggetto Email</Label>
                <Input 
                    id="email-subject" 
                    type="text"
                    readOnly 
                    value={emailSubject}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-300"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="email-body" className="text-slate-300">Corpo Email</Label>
                <Textarea
                    id="email-body"
                    readOnly
                    value={emailBody.trim()}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-300 h-64 resize-none"
                />
            </div>
            <p className="text-xs text-slate-500">
                <BookOpen size={14} className="inline mr-1" /> I riferimenti normativi sono inclusi.
                Ricorda di personalizzare i dettagli di contatto (es. "[Il Tuo Numero di Telefono/Link al Tuo Sito]") prima di un eventuale invio reale.
            </p>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
           <Button variant="outline" onClick={handleClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <X className="mr-2 h-4 w-4" /> Chiudi
          </Button>
          <Button onClick={handleSend} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
            <Send className="mr-2 h-4 w-4" /> Invia Email (Simulato)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreviewModal;
