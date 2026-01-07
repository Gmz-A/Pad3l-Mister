
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, ClipboardList, TrendingUp, Award, BookOpen, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TrainingLogView from './components/TrainingLogView';
import VideoAnalysisView from './components/VideoAnalysisView';
import VisualLearningView from './components/VisualLearningView';
import MatchLogView from './components/MatchLogView';
import { TrainingSession, AnalysisHistory, Match } from './types';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem('padel_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [analyses, setAnalyses] = useState<AnalysisHistory[]>(() => {
    const saved = localStorage.getItem('padel_analyses');
    return saved ? JSON.parse(saved) : [];
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('padel_matches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('padel_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('padel_analyses', JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    localStorage.setItem('padel_matches', JSON.stringify(matches));
  }, [matches]);

  const addSession = (session: TrainingSession) => {
    setSessions(prev => [session, ...prev]);
  };

  const addAnalysis = (analysis: AnalysisHistory) => {
    setAnalyses(prev => [analysis, ...prev]);
  };

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-700 p-4 sticky top-0 md:h-screen z-50">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-lime-400 p-2 rounded-lg">
              <Award className="text-slate-900 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PadelCoach <span className="text-lime-400">AI</span></h1>
          </div>

          <nav className="space-y-1">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/logs" icon={<ClipboardList size={20} />} label="Entrenamientos" />
            <NavLink to="/matches" icon={<Trophy size={20} />} label="Partidos" />
            <NavLink to="/analysis" icon={<Video size={20} />} label="Análisis de Vídeo" />
            <NavLink to="/learning" icon={<BookOpen size={20} />} label="Aprendizaje Visual" />
            <NavLink to="/stats" icon={<TrendingUp size={20} />} label="Progresión" />
          </nav>

          <div className="mt-auto hidden md:block pt-8 border-t border-slate-700">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Premium Status</p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></div>
                IA Activa (Gemini Flash)
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard sessions={sessions} analyses={analyses} />} />
              <Route path="/logs" element={<TrainingLogView sessions={sessions} onAddSession={addSession} />} />
              <Route path="/matches" element={<MatchLogView matches={matches} onAddMatch={addMatch} />} />
              <Route path="/analysis" element={<VideoAnalysisView analyses={analyses} onAddAnalysis={addAnalysis} />} />
              <Route path="/learning" element={<VisualLearningView />} />
              <Route path="/stats" element={<div className="flex flex-col items-center justify-center h-64 text-slate-400"><TrendingUp size={48} className="mb-4" /><p>Próximamente: Gráficas detalladas de tu evolución</p></div>} />
            </Routes>
          </div>
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 grid grid-cols-6 text-center p-2 z-50">
           <MobileNavLink to="/" icon={<LayoutDashboard size={24} />} />
           <MobileNavLink to="/logs" icon={<ClipboardList size={24} />} />
           <MobileNavLink to="/matches" icon={<Trophy size={24} />} />
           <MobileNavLink to="/analysis" icon={<Video size={24} />} />
           <MobileNavLink to="/learning" icon={<BookOpen size={24} />} />
           <MobileNavLink to="/stats" icon={<TrendingUp size={24} />} />
        </div>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-lime-400 text-slate-900 font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string, icon: React.ReactNode }> = ({ to, icon }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`p-2 rounded-lg transition-colors inline-flex justify-center ${active ? 'text-lime-400' : 'text-slate-400'}`}>
      {icon}
    </Link>
  );
};

export default App;
