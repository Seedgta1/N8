
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const IssuePoint = ({ top, left, message }) => (
  <motion.div
    className="absolute group"
    style={{ top: `${top}%`, left: `${left}%` }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
  >
    <AlertTriangle className="w-6 h-6 text-red-500 bg-white rounded-full p-1 shadow-lg cursor-pointer" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-900 text-white text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
      {message}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
    </div>
  </motion.div>
);

export default IssuePoint;
