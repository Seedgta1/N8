
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "admin@example.com"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true); // Assicurati che loading sia true all'inizio
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true); // Imposta loading a true quando cambia lo stato
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === ADMIN_EMAIL);
        setLoading(false);
        if (event === "SIGNED_IN") {
          toast({
            title: "Accesso Riuscito",
            description: `Benvenuto ${session?.user?.email}!`,
            className: "bg-green-500/10 text-green-300 border-green-500/40"
          });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast]);

  const login = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // setLoading(false) è gestito da onAuthStateChange
    if (error) {
      setLoading(false); // Assicurati di resettare loading in caso di errore immediato
      toast({
        variant: "destructive",
        title: "Accesso Fallito",
        description: error.message || "Credenziali non valide. Riprova.",
      });
      return false;
    }
    return true;
  };

  const signUp = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    // setLoading(false) è gestito da onAuthStateChange se la registrazione porta a SIGNED_IN
    // o deve essere gestito qui se non c'è un cambio di stato immediato
    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Registrazione Fallita",
        description: error.message || "Impossibile registrare l'utente. Riprova.",
      });
      return false;
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) {
       setLoading(false);
       toast({
        variant: "destructive",
        title: "Registrazione Fallita",
        description: "Un utente con questa email potrebbe già esistere ma non essere confermato.",
      });
      return false;
    }
    // Se la registrazione richiede conferma email, lo stato non cambia subito a SIGNED_IN
    // quindi setLoading(false) potrebbe essere necessario qui se non gestito da onAuthStateChange
    if (!data.session) { // Se non c'è sessione, l'utente deve confermare l'email
        setLoading(false);
    }
     toast({
      title: "Registrazione Riuscita",
      description: "Controlla la tua email per confermare la registrazione.",
    });
    return true;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, 
      },
    });
    // setLoading(false) è gestito da onAuthStateChange dopo il redirect
    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Accesso Google Fallito",
        description: error.message || "Impossibile accedere con Google. Riprova.",
      });
    }
  };


  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    // setLoading(false) è gestito da onAuthStateChange
    if (error) {
      setLoading(false);
       toast({
        variant: "destructive",
        title: "Errore Logout",
        description: error.message || "Impossibile effettuare il logout. Riprova.",
      });
      return false;
    }
    // setUser(null) e setIsAdmin(false) sono gestiti da onAuthStateChange
     toast({
        title: "Logout Effettuato",
        description: "Sei stato disconnesso con successo.",
      });
    return true;
  };
  
  const isAuthenticated = !!user;
  const isAdminAuthenticated = isAuthenticated && isAdmin;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isAdminAuthenticated, login, signUp, logout, signInWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
