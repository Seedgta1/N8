
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus, LogIn, Loader2, ShieldPlus, Chrome } from 'lucide-react'; // Aggiunto Chrome
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, signInWithGoogle, isAuthenticated, loading } = useAuth(); // Aggiunto signInWithGoogle
  const { toast } = useToast(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Errore Password",
        description: "Le password non coincidono.",
      });
      return;
    }
    if (password.length < 6) {
       toast({
        variant: "destructive",
        title: "Errore Password",
        description: "La password deve contenere almeno 6 caratteri.",
      });
      return;
    }
    const success = await signUp(email, password);
    if (success) {
      // Non navigare subito, l'utente deve confermare l'email
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // Il reindirizzamento e la gestione della sessione sono gestiti da Supabase e AuthContext
  };
  
  if (isAuthenticated) {
     return null; 
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-slate-800/70 backdrop-blur-lg border-slate-700 shadow-2xl shadow-purple-500/15">
          <CardHeader className="text-center">
            <ShieldPlus className="mx-auto h-16 w-16 text-purple-400 mb-4" />
            <CardTitle className="text-3xl font-bold text-slate-100">Crea un Account</CardTitle>
            <CardDescription className="text-slate-400">Registrati con email e password o usa Google.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-slate-300">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuamail@esempio.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-slate-300">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caratteri"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-signup" className="text-slate-300">Conferma Password</Label>
                <Input
                  id="confirm-password-signup"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ripeti la password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg" disabled={loading}>
                {loading && !email ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                Registrati
              </Button>
            </form>
            <div className="my-4 flex items-center before:flex-1 before:border-t before:border-slate-600 before:mt-0.5 after:flex-1 after:border-t after:border-slate-600 after:mt-0.5">
              <p className="mx-4 mb-0 text-center font-semibold text-slate-400">O</p>
            </div>
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full border-slate-600 hover:bg-slate-700/50 hover:border-purple-500 text-slate-300 hover:text-purple-300 py-3 text-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Chrome className="mr-2 h-5 w-5" />}
              Registrati con Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-slate-400">
              Hai già un account?{' '}
              <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 underline">
                Accedi qui
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
