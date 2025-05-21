
export const ALL_POSSIBLE_ISSUES = [
  { 
    id: "cookie_banner",
    text: "Manca un banner per il consenso dei cookie.", 
    description: "È obbligatorio un banner ben visibile che informi gli utenti sull'uso dei cookie e richieda il consenso esplicito prima di impostare cookie non essenziali.",
    position: { top: 88, left: 15 },
    criticality: "Alta",
    fine_amount_eur: 15000,
    category: "Cookie e Tracciamento",
    gdpr_article: "Art. 7 GDPR; Considerando 32, 42",
    norm_title: "Consenso Cookie e Trasparenza",
    practical_advice: "Implementa un banner di consenso cookie che blocchi i cookie non essenziali prima del consenso. Assicurati che sia facile per l'utente accettare, rifiutare o personalizzare le preferenze."
  },
  { 
    id: "privacy_policy_link",
    text: "Link all'informativa privacy non accessibile o mancante.", 
    description: "Un link chiaro e diretto all'informativa sulla privacy deve essere facilmente accessibile da ogni pagina del sito, tipicamente nel footer.",
    position: { top: 92, left: 50 },
    criticality: "Alta",
    fine_amount_eur: 10000,
    category: "Informativa Privacy",
    gdpr_article: "Art. 12, 13 GDPR",
    norm_title: "Accessibilità Informativa Privacy",
    practical_advice: "Aggiungi un link testuale ben visibile 'Informativa Privacy' o 'Privacy Policy' nel footer di tutte le pagine del tuo sito."
  },
  { 
    id: "privacy_policy_dpo",
    text: "Dettagli DPO mancanti o non chiari nell'informativa.", 
    description: "Se nominato, i dettagli di contatto del Data Protection Officer (DPO) devono essere inclusi e facilmente reperibili nell'informativa sulla privacy.",
    position: { top: 85, left: 20 },
    criticality: "Media",
    fine_amount_eur: 5000,
    category: "Informativa Privacy",
    gdpr_article: "Art. 37(7) GDPR",
    norm_title: "Informazioni sul DPO",
    practical_advice: "Se la tua organizzazione ha un DPO, includi nome, indirizzo email e numero di telefono (se disponibile) in una sezione dedicata dell'informativa privacy."
  },
  { 
    id: "data_minimization_forms",
    text: "Eccessiva raccolta dati nei moduli di contatto/registrazione.", 
    description: "I moduli devono raccogliere solo i dati personali strettamente necessari per la finalità dichiarata (principio di minimizzazione dei dati).",
    position: { top: 50, left: 70 },
    criticality: "Media",
    fine_amount_eur: 7500,
    category: "Raccolta Dati e Consenso",
    gdpr_article: "Art. 5(1)(c) GDPR",
    norm_title: "Minimizzazione dei Dati",
    practical_advice: "Rivedi tutti i moduli del sito. Per ogni campo, chiediti se è assolutamente indispensabile per lo scopo del modulo. Rimuovi i campi non necessari."
  },
  { 
    id: "consent_checkboxes",
    text: "Consenso per marketing/profilazione non pre-deselezionato o non granulare.", 
    description: "Le caselle di controllo per il consenso a trattamenti specifici (es. marketing, profilazione) devono essere deselezionate per impostazione predefinita e separate per finalità.",
    position: { top: 65, left: 30 },
    criticality: "Alta",
    fine_amount_eur: 20000,
    category: "Raccolta Dati e Consenso",
    gdpr_article: "Art. 7 GDPR; Considerando 32",
    norm_title: "Modalità del Consenso",
    practical_advice: "Assicurati che tutte le checkbox per il consenso (es. iscrizione newsletter, profilazione) siano deselezionate di default. Fornisci checkbox separate per diverse finalità di trattamento."
  },
  {
    id: "data_retention_policy",
    text: "Politica di conservazione dei dati non chiara o mancante.",
    description: "L'informativa sulla privacy deve specificare chiaramente per quanto tempo i dati personali verranno conservati e i criteri utilizzati per determinare tale periodo.",
    position: { top: 20, left: 60},
    criticality: "Media",
    fine_amount_eur: 6000,
    category: "Informativa Privacy",
    gdpr_article: "Art. 5(1)(e); Art. 13(2)(a) GDPR",
    norm_title: "Limitazione della Conservazione",
    practical_advice: "Definisci e documenta i periodi di conservazione per ciascuna categoria di dati personali trattati. Includi queste informazioni nell'informativa privacy."
  },
  {
    id: "right_to_erasure",
    text: "Manca un meccanismo chiaro per esercitare il diritto all'oblio.",
    description: "Gli utenti devono avere un modo semplice, accessibile e chiaramente indicato per richiedere la cancellazione dei propri dati personali.",
    position: { top: 70, left: 80},
    criticality: "Alta",
    fine_amount_eur: 18000,
    category: "Diritti degli Interessati",
    gdpr_article: "Art. 17 GDPR",
    norm_title: "Diritto alla Cancellazione (Oblio)",
    practical_advice: "Indica nell'informativa privacy come gli utenti possono richiedere la cancellazione dei dati (es. un indirizzo email dedicato, un modulo online). Prepara una procedura interna per gestire tali richieste."
  },
  {
    id: "data_security_https",
    text: "Sito non interamente servito tramite HTTPS.",
    description: "Tutte le pagine del sito, specialmente quelle che raccolgono o trasmettono dati personali, devono utilizzare HTTPS per garantire la crittografia e la sicurezza.",
    position: { top: 5, left: 10},
    criticality: "Alta",
    fine_amount_eur: 25000,
    category: "Sicurezza dei Dati",
    gdpr_article: "Art. 32 GDPR",
    norm_title: "Sicurezza del Trattamento",
    practical_advice: "Installa un certificato SSL/TLS sul tuo server e configura il sito per forzare la connessione HTTPS su tutte le pagine. Verifica la presenza di contenuti misti (mixed content)."
  },
  {
    id: "third_party_cookies",
    text: "Cookie di terze parti (marketing, profilazione) impostati prima del consenso.",
    description: "I cookie di terze parti non essenziali non devono essere caricati o attivati prima che l'utente abbia fornito un consenso esplicito e informato.",
    position: { top: 80, left: 70},
    criticality: "Alta",
    fine_amount_eur: 22000,
    category: "Cookie e Tracciamento",
    gdpr_article: "Art. 7 GDPR; Direttiva ePrivacy",
    norm_title: "Consenso per Cookie di Terze Parti",
    practical_advice: "Utilizza uno strumento di gestione del consenso (CMP) o configura manualmente il blocco preventivo degli script di terze parti che impostano cookie non essenziali."
  },
  {
    id: "analytics_consent",
    text: "Script di analytics (es. Google Analytics) attivati prima del consenso ai cookie.",
    description: "Gli script di analisi statistica che utilizzano cookie non essenziali devono essere caricati solo dopo aver ottenuto il consenso specifico dell'utente.",
    position: { top: 10, left: 85},
    criticality: "Media",
    fine_amount_eur: 9000,
    category: "Cookie e Tracciamento",
    gdpr_article: "Art. 7 GDPR; Direttiva ePrivacy",
    norm_title: "Consenso per Analytics",
    practical_advice: "Condiziona il caricamento degli script di analytics (come Google Analytics) al consenso dell'utente per i cookie statistici/analitici."
  },
  {
    id: "vat_number_check",
    text: "Partita IVA non visibile o mancante nella homepage/footer.",
    description: "Per le attività commerciali, la Partita IVA dovrebbe essere chiaramente visibile, solitamente nel footer o nella pagina contatti, come richiesto anche da normative fiscali e commerciali.",
    position: { top: 95, left: 30 },
    criticality: "Bassa",
    fine_amount_eur: 1000,
    category: "Trasparenza Aziendale",
    gdpr_article: "N/A (Obbligo Fiscale/Commerciale)",
    norm_title: "Visibilità Partita IVA",
    practical_advice: "Se sei un'azienda o un professionista con Partita IVA, assicurati che sia indicata nel footer del sito o nella pagina 'Contatti'."
  },
  {
    id: "contact_email_check",
    text: "Indirizzo email di contatto non facilmente reperibile.",
    description: "Un indirizzo email o un modulo di contatto devono essere facilmente accessibili per permettere agli utenti di comunicare con l'azienda, anche ai fini dell'esercizio dei diritti GDPR.",
    position: { top: 90, left: 70 },
    criticality: "Bassa",
    fine_amount_eur: 500,
    category: "Trasparenza Aziendale",
    gdpr_article: "Art. 12, 13 GDPR",
    norm_title: "Facilità di Contatto",
    practical_advice: "Rendi ben visibile un indirizzo email di contatto o un link a una pagina 'Contatti' con un modulo funzionante."
  },
  {
    id: "physical_address_check",
    text: "Indirizzo fisico dell'attività non specificato (se applicabile).",
    description: "Se l'attività ha una sede fisica rilevante per i clienti o come sede legale, questa dovrebbe essere indicata, ad esempio nella pagina contatti o nel footer.",
    position: { top: 93, left: 80 },
    criticality: "Bassa",
    fine_amount_eur: 1500,
    category: "Trasparenza Aziendale",
    gdpr_article: "N/A (Obbligo Commerciale)",
    norm_title: "Visibilità Sede Legale/Operativa",
    practical_advice: "Se applicabile, includi l'indirizzo della sede legale o operativa della tua attività nel footer o nella pagina 'Contatti'."
  },
  {
    id: "privacy_policy_completeness",
    text: "Informativa privacy sembra incompleta o generica.",
    description: "L'informativa privacy deve essere dettagliata, specifica per i trattamenti effettuati dal sito e scritta in linguaggio chiaro. Valutare la presenza di tutte le sezioni richieste dagli Art. 13 e 14 GDPR.",
    position: { top: 50, left: 10 },
    criticality: "Media",
    fine_amount_eur: 8000,
    category: "Informativa Privacy",
    gdpr_article: "Art. 13, 14 GDPR",
    norm_title: "Completezza Informativa Privacy",
    practical_advice: "Rivedi la tua informativa privacy confrontandola con i requisiti degli articoli 13 e 14 del GDPR. Assicurati che copra tutti i trattamenti di dati effettuati, le finalità, le basi giuridiche, i periodi di conservazione, i diritti degli interessati, ecc."
  }
];

export const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return Math.abs(hash);
};

export const getDeterministicIssues = (hashedUrl) => {
  const isCompliantDeterminedByHash = (hashedUrl % 10) < (process.env.NODE_ENV === 'development' ? 1 : 3) ; 

  if (isCompliantDeterminedByHash) {
    return []; 
  }

  const numIssuesSeed = (hashedUrl % 100) + 1;
  const numIssues = (numIssuesSeed % (Math.min(7, ALL_POSSIBLE_ISSUES.length) -1)) + 1;
  
  const issuesCopy = [...ALL_POSSIBLE_ISSUES];
  
  let seed = hashedUrl;
  const pseudoRandom = (s) => {
      let x = Math.sin(s) * 10000;
      return x - Math.floor(x);
  };

  for (let i = issuesCopy.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom(seed) * (i + 1));
      [issuesCopy[i], issuesCopy[j]] = [issuesCopy[j], issuesCopy[i]];
      seed++;
  }
  
  return issuesCopy.slice(0, numIssues);
};
