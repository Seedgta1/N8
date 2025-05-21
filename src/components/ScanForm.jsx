
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap } from 'lucide-react';

const ScanForm = ({ url, setUrl, handleSubmit, isLoading }) => {
  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mt-8 mb-8"
    >
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700 shadow-2xl shadow-purple-500/10">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-4"
          >
            <ShieldCheck className="w-20 h-20 text-purple-400" />
          </motion.div>
          <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Verifica Conformità GDPR
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg mt-2">
            Inserisci l'URL del tuo sito per verificare la sua conformità al GDPR e ottenere suggerimenti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-slate-300 text-sm font-medium">URL del Sito Web</Label>
              <Input
                id="url"
                type="text" 
                placeholder="esempio.com" 
                value={url}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500 h-12 text-base"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-transparent border-t-white rounded-full mr-2"
                ></motion.div>
              ) : (
                <Zap className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Analisi in corso...' : 'Verifica Ora'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScanForm;
