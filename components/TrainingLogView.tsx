
import React, { useState } from 'react';
import { TrainingSession, ShotType } from '../types';
import { Plus, ClipboardList, Trash2, X } from 'lucide-react';

interface TrainingLogViewProps {
  sessions: TrainingSession[];
  onAddSession: (session: TrainingSession) => void;
}

const SHOT_TYPES: ShotType[] = ['Derecha', 'Revés', 'Volea', 'Bandeja', 'Víbora', 'Remate', 'Globo', 'Bajada de pared'];

const TrainingLogView: React.FC<TrainingLogViewProps> = ({ sessions, onAddSession }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    shots: [] as ShotType[],
    duration: 60,
    intensity: 'Media' as 'Baja' | 'Media' | 'Alta',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const toggleShot = (shot: ShotType) => {
    setFormData(prev => ({
      ...prev,
      shots: prev.shots.includes(shot) 
        ? prev.shots.filter(s => s !== shot)
        : [...prev.shots, shot]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.shots.length === 0) return alert('Selecciona al menos un golpe entrenado');

    const newSession: TrainingSession = {
      id: crypto.randomUUID(),
      ...formData
    };

    onAddSession(newSession);
    setShowModal(false);
    setFormData({
      shots: [],
      duration: 60,
      intensity: 'Media',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Historial de Entrenamientos</h2>
          <p className="text-slate-400 text-sm">Registra cada sesión para trackear tu progreso.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-lime-400 text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-lime-300 transition-colors"
        >
          <Plus size={20} />
          Nuevo Registro
        </button>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <ClipboardList size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500">No hay sesiones registradas.</p>
          </div>
        ) : (
          sessions.map(s => (
            <div key={s.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    s.intensity === 'Alta' ? 'bg-red-500/20 text-red-400' :
                    s.intensity === 'Media' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    Intensidad {s.intensity}
                  </span>
                  <span className="text-slate-500 text-sm">{new Date(s.date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.shots.map(shot => (
                    <span key={shot} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-xs font-medium border border-slate-600">
                      {shot}
                    </span>
                  ))}
                </div>
                {s.notes && <p className="text-sm text-slate-400 italic">"{s.notes}"</p>}
              </div>
              <div className="flex items-center gap-8 text-right shrink-0">
                <div>
                  <p className="text-2xl font-bold">{s.duration}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Minutos</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">Registrar Entrenamiento</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">¿Qué golpes has entrenado hoy?</label>
                <div className="flex flex-wrap gap-2">
                  {SHOT_TYPES.map(shot => (
                    <button
                      key={shot}
                      type="button"
                      onClick={() => toggleShot(shot)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        formData.shots.includes(shot)
                          ? 'bg-lime-400 text-slate-900 border-lime-400'
                          : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {shot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Intensidad</label>
                  <select
                    value={formData.intensity}
                    onChange={e => setFormData(prev => ({ ...prev, intensity: e.target.value as any }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Notas (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ej: Hoy me he centrado en cerrar más el codo en la bandeja..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5 h-24 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-lime-400 text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-lime-300 transition-colors"
                >
                  Guardar Entrenamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingLogView;
