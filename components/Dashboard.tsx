
import React, { useEffect, useState } from 'react';
import { TrainingSession, AnalysisHistory } from '../types';
// Fix: Added Award to the imported icons
import { Calendar, Flame, Target, MessageSquare, Award } from 'lucide-react';
import { getDailyAdvice } from '../services/geminiService';

interface DashboardProps {
  sessions: TrainingSession[];
  analyses: AnalysisHistory[];
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, analyses }) => {
  const [advice, setAdvice] = useState<string>('Analizando tus últimos movimientos...');
  
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await getDailyAdvice(sessions.slice(0, 5));
        setAdvice(res);
      } catch (e) {
        setAdvice('Hoy es un día perfecto para trabajar tu defensa en el fondo de pista.');
      }
    };
    fetchAdvice();
  }, [sessions]);

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const bestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.analysis?.overallScore || 0)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-bold mb-2">Hola, Campeón 👋</h2>
        <p className="text-slate-400">Aquí tienes el resumen de tu preparación técnica.</p>
      </header>

      {/* AI Advice Card */}
      <div className="bg-gradient-to-br from-lime-400/20 to-emerald-500/20 border border-lime-400/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-lime-400/10 group-hover:text-lime-400/20 transition-colors">
          <MessageSquare size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-lime-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase">Consejo del Coach IA</span>
          </div>
          <p className="text-xl font-medium leading-relaxed italic">"{advice}"</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Calendar className="text-blue-400" />} 
          label="Sesiones" 
          value={sessions.length.toString()} 
          subtitle="Entrenamientos registrados"
        />
        <StatCard 
          icon={<Flame className="text-orange-400" />} 
          label="Tiempo Total" 
          value={`${totalMinutes} min`} 
          subtitle="En pista"
        />
        <StatCard 
          icon={<Target className="text-lime-400" />} 
          label="Mejor Nota" 
          value={`${bestScore}/10`} 
          subtitle="Análisis técnico"
        />
        <StatCard 
          icon={<Award className="text-purple-400" />} 
          label="Análisis" 
          value={analyses.length.toString()} 
          subtitle="Vídeos analizados"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-lime-400" />
            Entrenamientos Recientes
          </h3>
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <p className="text-slate-500 py-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">Aún no has registrado entrenamientos.</p>
            ) : (
              sessions.slice(0, 3).map(s => (
                <div key={s.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{s.shots.join(', ')}</p>
                    <p className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{s.duration} min</span>
                    <p className={`text-[10px] uppercase font-bold ${s.intensity === 'Alta' ? 'text-red-400' : s.intensity === 'Media' ? 'text-yellow-400' : 'text-green-400'}`}>{s.intensity}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Analysis */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={20} className="text-lime-400" />
            Últimos Análisis Técnica
          </h3>
          <div className="space-y-3">
            {analyses.length === 0 ? (
              <p className="text-slate-500 py-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">Sube un vídeo para recibir feedback técnico.</p>
            ) : (
              analyses.slice(0, 3).map(a => (
                <div key={a.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-lime-400 font-bold">
                    {a.analysis?.overallScore}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{a.shotType}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{a.analysis?.coachFeedback}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(a.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subtitle: string }> = ({ icon, label, value, subtitle }) => (
  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 transition-all hover:border-slate-600">
    <div className="flex items-center gap-3 mb-3 text-slate-400">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs text-slate-500">{subtitle}</div>
  </div>
);

export default Dashboard;
