
import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ShieldAlert, FileText, TrendingUp, TrendingDown, Info, BookOpen, Wrench, Lightbulb } from 'lucide-react';

const DetailedReport = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return null;
  }

  const totalPotentialFine = issues.reduce((sum, issue) => sum + (issue.fine_amount_eur || 0), 0);

  const getCriticalityIndicator = (criticality) => {
    switch (criticality?.toLowerCase()) {
      case 'alta':
        return <TrendingDown className="h-4 w-4 text-red-400 mr-1 flex-shrink-0" />;
      case 'media':
        return <Info className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />;
      case 'bassa':
        return <TrendingUp className="h-4 w-4 text-green-400 mr-1 flex-shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-slate-400 mr-1 flex-shrink-0" />;
    }
  };
  
  const getCriticalityClass = (criticality) => {
    switch (criticality?.toLowerCase()) {
      case 'alta':
        return 'text-red-300 bg-red-900/40 border-red-700/60';
      case 'media':
        return 'text-yellow-300 bg-yellow-900/40 border-yellow-700/60';
      case 'bassa':
        return 'text-green-300 bg-green-900/40 border-green-700/60';
      default:
        return 'text-slate-300 bg-slate-700/40 border-slate-600/60';
    }
  };

  const getCategoryClass = (category) => {
    const colors = {
      "Cookie e Tracciamento": "bg-sky-500/20 text-sky-300 border-sky-500/40",
      "Informativa Privacy": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      "Raccolta Dati e Consenso": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
      "Diritti degli Interessati": "bg-rose-500/20 text-rose-300 border-rose-500/40",
      "Sicurezza dei Dati": "bg-amber-500/20 text-amber-300 border-amber-500/40",
      "Trasparenza Aziendale": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      "Default": "bg-slate-500/20 text-slate-300 border-slate-500/40"
    };
    return colors[category] || colors["Default"];
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 p-4 sm:p-6 bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl"
    >
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-slate-100 flex items-center">
        <FileText className="mr-3 text-purple-400 h-6 w-6 sm:h-7 sm:w-7" />
        Report Dettagliato delle Infrazioni
      </h3>

      <div className="space-y-5">
        {issues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-3 sm:p-4 rounded-lg border hover:shadow-lg transition-all duration-300 ${getCriticalityClass(issue.criticality)}`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
              <h4 className="text-md sm:text-lg font-semibold flex items-start">
                <AlertOctagon className="mr-2 sm:mr-2.5 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{issue.text}</span>
              </h4>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-shrink-0 mt-2 sm:mt-0 self-start sm:self-center">
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center ${getCategoryClass(issue.category)}`}>
                  {issue.category || "Generale"}
                </span>
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center ${getCriticalityClass(issue.criticality)} border-none`}>
                  {getCriticalityIndicator(issue.criticality)}
                  {issue.criticality}
                </span>
              </div>
            </div>
            <p className="text-sm text-current/80 mb-3 ml-1 sm:ml-[calc(1.25rem+0.625rem)]">{issue.description}</p>
            
            <div className="ml-1 sm:ml-[calc(1.25rem+0.625rem)] mt-3 space-y-2">
                <div className="p-2 sm:p-3 bg-black/20 rounded-md border border-current/20">
                    <p className="text-xs font-semibold text-current/90 flex items-center mb-1">
                        <BookOpen size={14} className="mr-2 text-purple-300 flex-shrink-0"/>
                        Riferimento Normativo Potenziale:
                    </p>
                    <p className="text-xs text-current/70">
                        <span className="font-medium">{issue.norm_title || "Non specificato"}</span> ({issue.gdpr_article || "N/A"})
                    </p>
                </div>
                {issue.practical_advice && (
                    <div className="p-2 sm:p-3 bg-black/20 rounded-md border border-current/20">
                        <p className="text-xs font-semibold text-current/90 flex items-center mb-1">
                            <Lightbulb size={14} className="mr-2 text-yellow-300 flex-shrink-0"/>
                            Consiglio Pratico:
                        </p>
                        <p className="text-xs text-current/70">
                            {issue.practical_advice}
                        </p>
                    </div>
                )}
            </div>

            {issue.fine_amount_eur > 0 && (
              <div className="text-right mt-3">
                <p className="text-xs text-current/70">Multa potenziale stimata:</p>
                <p className="text-md sm:text-lg font-bold">€ {issue.fine_amount_eur.toLocaleString('it-IT')}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {totalPotentialFine > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 bg-red-800/30 backdrop-blur-sm border border-red-700 rounded-lg">
            <div className="mb-2 sm:mb-0">
              <h4 className="text-lg sm:text-xl font-semibold text-red-300 flex items-center">
                <ShieldAlert className="mr-2 sm:mr-2.5 h-5 w-5 sm:h-6 sm:w-6" />
                Stima Multa Totale Potenziale
              </h4>
              <p className="text-xs sm:text-sm text-red-400 mt-1">Basata sulle infrazioni rilevate in questa analisi simulata.</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-300 mt-2 sm:mt-0">€ {totalPotentialFine.toLocaleString('it-IT')}</p>
          </div>
        </div>
      )}
       <p className="text-xs text-slate-500 mt-6 text-center">
        Disclaimer: Le stime delle multe sono puramente indicative e basate su valori fittizi. 
        La determinazione effettiva delle sanzioni GDPR è un processo complesso e dipende da numerosi fattori specifici. 
        Questo report non costituisce consulenza legale.
      </p>
    </motion.div>
  );
};

export default DetailedReport;
