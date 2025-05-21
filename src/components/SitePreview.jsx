
import React from 'react';
import IssuePoint from '@/components/IssuePoint';
import { AlertTriangle, Eye, Info } from 'lucide-react';

const SitePreview = ({ siteUrl, issues }) => {
  const [iframeKey, setIframeKey] = React.useState(Date.now());

  React.useEffect(() => {
    setIframeKey(Date.now()); 
  }, [siteUrl]);

  return (
    <div>
      <h4 className="text-xl font-semibold mb-3 text-slate-200 flex items-center"><Eye className="mr-2 text-purple-400" /> Anteprima Sito con Problemi</h4>
      <div className="relative aspect-[16/9] bg-slate-700 rounded-lg overflow-hidden shadow-lg border border-slate-600">
        {siteUrl ? (
          <iframe
            key={iframeKey}
            src={siteUrl}
            title="Anteprima Sito Web"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            onError={() => console.warn(`L'iframe per ${siteUrl} non può essere caricato. Potrebbe essere bloccato dalle policy X-Frame-Options.`)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-600">
            <p className="text-slate-400">Inserisci un URL per vedere l'anteprima.</p>
          </div>
        )}
        {issues && issues.length > 0 && issues.map((issue, index) => (
          issue.position && <IssuePoint key={index} top={issue.position.top} left={issue.position.left} message={issue.text} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <p className="text-slate-300 text-sm italic p-4 text-center">
            {siteUrl ? "L'anteprima mostra le posizioni approssimative dei problemi." : "L'anteprima apparirà qui."}
          </p>
        </div>
      </div>
      {siteUrl && issues && issues.length > 0 && (
         <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center"><Info size={14} className="mr-1"/> Passa il mouse sui <AlertTriangle size={14} className="inline mx-1 text-red-400"/> per i dettagli.</p>
      )}
       {!siteUrl && (
        <p className="text-xs text-slate-500 mt-2 text-center">L'anteprima interattiva del sito apparirà qui una volta inserito un URL.</p>
      )}
    </div>
  );
};

export default SitePreview;
