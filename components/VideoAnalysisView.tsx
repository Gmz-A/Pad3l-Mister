
import React, { useState, useRef } from 'react';
import { AnalysisHistory, ShotType, AnalysisResult } from '../types';
import { Upload, Play, CheckCircle2, AlertCircle, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { analyzePadelVideo } from '../services/geminiService';

interface VideoAnalysisViewProps {
  analyses: AnalysisHistory[];
  onAddAnalysis: (analysis: AnalysisHistory) => void;
}

const SHOT_TYPES: ShotType[] = ['Derecha', 'Revés', 'Volea', 'Bandeja', 'Víbora', 'Remate', 'Globo', 'Bajada de pared'];

const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({ analyses, onAddAnalysis }) => {
  const [file, setFile] = useState<File | null>(null);
  const [shotType, setShotType] = useState<ShotType>('Derecha');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setProgress('Subiendo y procesando vídeo...');

    try {
      const base64 = await convertToBase64(file);
      setProgress('La IA está analizando tu técnica...');
      
      const result = await analyzePadelVideo(base64, file.type, shotType);
      
      const newAnalysis: AnalysisHistory = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        shotType,
        analysis: result
      };

      onAddAnalysis(newAnalysis);
      setSelectedAnalysis(newAnalysis);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error(error);
      alert('Error al analizar el vídeo. Asegúrate de que el vídeo sea corto y de formato compatible.');
    } finally {
      setIsAnalyzing(false);
      setProgress('');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Análisis Técnico IA <Sparkles className="text-lime-400" size={24} />
        </h2>
        <p className="text-slate-400">Sube un clip de tu golpe y deja que la IA detecte fallos y te recomiende mejoras.</p>
      </header>

      {/* Upload Zone */}
      <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center">
        {!isAnalyzing ? (
          <div className="max-w-md mx-auto space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer group"
            >
              <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-400/20 group-hover:text-lime-400 transition-colors">
                <Upload size={32} />
              </div>
              <p className="text-lg font-semibold">{file ? file.name : 'Seleccionar Vídeo'}</p>
              <p className="text-sm text-slate-500">Formato MP4, MOV. Máximo 10MB para mejores resultados.</p>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="video/*" 
            />

            {file && (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">¿Qué golpe aparece en el vídeo?</label>
                  <select 
                    value={shotType}
                    onChange={(e) => setShotType(e.target.value as ShotType)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5"
                  >
                    {SHOT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button 
                  onClick={startAnalysis}
                  className="w-full bg-lime-400 text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-lime-300"
                >
                  <Play size={20} />
                  Analizar Técnica con IA
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-6">
            <Loader2 size={48} className="text-lime-400 animate-spin" />
            <div className="space-y-2">
              <p className="text-xl font-bold text-lime-400">{progress}</p>
              <p className="text-slate-500">Esto puede tardar unos 20-30 segundos.</p>
            </div>
          </div>
        )}
      </div>

      {/* Results or History */}
      {selectedAnalysis ? (
        <AnalysisDetails analysis={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
      ) : (
        <section>
          <h3 className="text-xl font-bold mb-4">Historial de Análisis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map(a => (
              <div 
                key={a.id} 
                onClick={() => setSelectedAnalysis(a)}
                className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-lime-400/50 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">{a.shotType}</span>
                  <div className="text-lg font-bold text-lime-400">{a.analysis?.overallScore}/10</div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 italic">"{a.analysis?.coachFeedback}"</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
            {analyses.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                No tienes análisis previos. ¡Sube tu primer vídeo!
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const AnalysisDetails: React.FC<{ analysis: AnalysisHistory, onClose: () => void }> = ({ analysis, onClose }) => {
  const res = analysis.analysis;
  if (!res) return null;

  return (
    <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden animate-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3">
            Análisis de {analysis.shotType}
            <span className="text-lime-400 text-lg">({res.overallScore}/10)</span>
          </h3>
          <p className="text-slate-400 text-sm">{new Date(analysis.date).toLocaleString()}</p>
        </div>
        <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 p-2 rounded-full transition-colors">
          <ChevronRight size={24} className="rotate-180" />
        </button>
      </div>

      <div className="p-8 space-y-8">
        <section className="bg-lime-400/5 p-6 rounded-2xl border border-lime-400/20">
          <h4 className="text-lime-400 font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
             Feedback del Coach Profesional
          </h4>
          <p className="text-xl italic leading-relaxed">"{res.coachFeedback}"</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2 text-green-400">
              <CheckCircle2 size={20} /> Puntos Fuertes
            </h4>
            <ul className="space-y-2">
              {res.pros.map((p, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                  <span className="text-green-500">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2 text-red-400">
              <AlertCircle size={20} /> Áreas de Mejora
            </h4>
            <ul className="space-y-2">
              {res.cons.map((c, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                  <span className="text-red-500">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="pt-8 border-t border-slate-700">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Target className="text-lime-400" /> Ejercicios Recomendados (Drills)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {res.drills.map((d, i) => (
              <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-slate-800 text-3xl font-black italic select-none group-hover:text-lime-400/5 transition-colors">{i+1}</div>
                <p className="text-sm font-medium relative z-10">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Re-using the Target icon from the types file context
const Target: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

export default VideoAnalysisView;
