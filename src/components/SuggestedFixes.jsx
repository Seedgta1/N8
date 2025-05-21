
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Cog } from 'lucide-react';

const SuggestedFixes = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return <p className="text-slate-400">Nessun suggerimento specifico disponibile per questa scansione.</p>;
  }

  return (
    <div>
      <h4 className="text-xl font-semibold mb-3 text-slate-200 flex items-center"><Cog className="mr-2 text-purple-400" /> Modifiche Suggerite</h4>
      <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {suggestions.map((suggestion, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start p-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-purple-500 transition-colors"
          >
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-red-400 flex-shrink-0" />
            <span className="text-slate-300">{suggestion.text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedFixes;
