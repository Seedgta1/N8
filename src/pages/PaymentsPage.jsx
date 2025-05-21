
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, DollarSign, Info, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const STRIPE_PUBLISHABLE_KEY = 'INSERISCI_LA_TUA_CHIAVE_PUBBLICABILE_STRIPE_QUI'; 
const STRIPE_PRICE_ID = 'INSERISCI_IL_TUO_ID_PREZZO_STRIPE_QUI'; 

const stripePromise = STRIPE_PUBLISHABLE_KEY.startsWith('pk_') ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const PaymentsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isStripeConfigured, setIsStripeConfigured] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSubscriptionStatus, setLoadingSubscriptionStatus] = useState(true);

  useEffect(() => {
    if (STRIPE_PUBLISHABLE_KEY.startsWith('pk_') && STRIPE_PRICE_ID.startsWith('price_')) {
      setIsStripeConfigured(true);
    }
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        setLoadingSubscriptionStatus(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('is_subscribed, stripe_customer_id')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
            throw error;
          }
          if (data && data.is_subscribed) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error("Errore nel controllo dello stato dell'abbonamento:", error);
          setIsSubscribed(false);
        } finally {
          setLoadingSubscriptionStatus(false);
        }
      } else {
        setIsSubscribed(false);
        setLoadingSubscriptionStatus(false);
      }
    };

    checkSubscription();
  }, [user]);


  const handleCheckout = async () => {
    if (!stripePromise) {
      toast({
        variant: "destructive",
        title: "Stripe non configurato",
        description: "La chiave pubblicabile di Stripe non è valida. Controlla la configurazione.",
      });
      return;
    }

    if (!STRIPE_PRICE_ID.startsWith('price_')) {
      toast({
        variant: "destructive",
        title: "ID Prezzo Stripe non valido",
        description: "L'ID del prezzo di Stripe non è valido. Controlla la configurazione.",
      });
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
        console.error("Istanza Stripe non disponibile dopo il caricamento.");
        return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/admin/payments?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/admin/payments?payment_cancelled=true`,
      clientReferenceId: user ? user.id : undefined, // Utile per riconciliare con l'utente
      customerEmail: user ? user.email : undefined, // Precompila l'email se l'utente è loggato
    });

    if (error) {
      console.error("Errore Stripe Checkout:", error);
      toast({
        variant: "destructive",
        title: "Errore Checkout",
        description: error.message || "Si è verificato un errore durante il reindirizzamento a Stripe.",
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentSuccess = queryParams.get('payment_success');
    const paymentCancelled = queryParams.get('payment_cancelled');
    // const sessionId = queryParams.get('session_id'); // Potrebbe servire per una verifica server-side

    if (paymentSuccess && user) {
      const updateUserProfileAsSubscribed = async () => {
        try {
          const { error } = await supabase
            .from('user_profiles')
            .upsert({ id: user.id, is_subscribed: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
          
          if (error) throw error;
          
          setIsSubscribed(true);
          toast({
            title: "Pagamento Riuscito!",
            description: "Grazie per il tuo abbonamento. Ora hai accesso a tutte le funzionalità.",
            className: "bg-green-500/10 text-green-300 border-green-500/40"
          });
        } catch (error) {
          console.error("Errore nell'aggiornamento del profilo utente:", error);
           toast({
            variant: "destructive",
            title: "Errore Aggiornamento Profilo",
            description: "Pagamento riuscito, ma c'è stato un problema nell'aggiornare il tuo stato di abbonamento.",
          });
        }
      };
      updateUserProfileAsSubscribed();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentCancelled) {
      toast({
        title: "Pagamento Annullato",
        description: "Il processo di pagamento è stato annullato.",
        variant: "default",
        className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/40"
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, user]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-slate-100 flex items-center">
              <CreditCard className="mr-3 text-purple-400 h-8 w-8" />
              Gestione Abbonamento
            </CardTitle>
            {isStripeConfigured && <Zap className="h-6 w-6 text-green-400 animate-pulse" title="Stripe Configurato" />}
          </div>
          <CardDescription className="text-slate-400">
            {isSubscribed ? "Grazie per esserti abbonato al nostro servizio." : "Sottoscrivi il nostro piano per accedere a tutte le funzionalità premium."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isStripeConfigured && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
              <h4 className="font-semibold text-lg flex items-center mb-2"><Info className="mr-2" />Stripe non configurato correttamente!</h4>
              <p className="text-sm">
                Per abilitare i pagamenti, un amministratore deve inserire la Chiave Pubblicabile di Stripe e un ID Prezzo valido nel file <code className="px-1 py-0.5 bg-slate-700 rounded text-xs">src/pages/PaymentsPage.jsx</code>.
              </p>
              <p className="text-sm mt-2">
                Seguire le istruzioni fornite da Stripe per ottenere queste chiavi.
              </p>
            </div>
          )}

          {loadingSubscriptionStatus && isStripeConfigured && (
            <div className="text-center p-4 text-slate-300">
              <Info className="mx-auto h-8 w-8 mb-2 animate-pulse" />
              Verifica stato abbonamento...
            </div>
          )}
          
          {!loadingSubscriptionStatus && isStripeConfigured && (
            isSubscribed ? (
              <div className="p-6 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 flex items-center">
                <CheckCircle className="h-10 w-10 mr-4 text-green-400" />
                <div>
                  <h4 className="font-semibold text-xl">Sei Abbonato!</h4>
                  <p className="text-sm">Hai accesso a tutte le funzionalità premium, incluso lo script di correzione dettagliato.</p>
                  {/* In futuro: <Button variant="link" className="text-purple-400 p-0 h-auto mt-1">Gestisci il tuo abbonamento su Stripe</Button> */}
                </div>
              </div>
            ) : (
              <Card className="bg-slate-700/50 border-slate-600 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-slate-200 flex items-center"><DollarSign className="mr-2 text-green-400"/>Abbonamento GDPR Scan Pro</CardTitle>
                  <CardDescription className="text-slate-400">Sblocca tutte le funzionalità con il nostro piano mensile.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-slate-300 mb-1"><strong>Prodotto:</strong> Accesso Premium GDPR Scan Pro</p>
                  <p className="text-slate-300 mb-4"><strong>Costo:</strong> (Visualizzato su Stripe)</p>
                  <Button 
                    onClick={handleCheckout} 
                    disabled={!isStripeConfigured || !user}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {user ? "Abbonati Ora con Stripe" : "Accedi per Abbonarti"}
                  </Button>
                  {!user && <p className="text-xs text-yellow-400 mt-2">Devi essere loggato per sottoscrivere un abbonamento.</p>}
                  {!isStripeConfigured && <p className="text-xs text-yellow-400 mt-2">Il pulsante di pagamento è disabilitato finché Stripe non è configurato dall'admin.</p>}
                </CardContent>
              </Card>
            )
          )}
           <div className="p-4 bg-sky-900/30 border border-sky-700/50 rounded-lg text-sky-300 mt-8">
              <h4 className="font-semibold text-lg flex items-center mb-2"><Info className="mr-2" />Nota Importante</h4>
              <p className="text-sm">
                La gestione completa dell'abbonamento (modifiche, cancellazioni, fatture) avviene tramite la dashboard di Stripe a cui verrai reindirizzato.
                Questa pagina simula l'aggiornamento dello stato di abbonamento nel nostro sistema dopo un pagamento andato a buon fine.
              </p>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentsPage;
