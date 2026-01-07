
import React, { useState } from 'react';
import { Match, ShotType } from '../types';
import { Plus, Trophy, X, CheckCircle, AlertCircle } from 'lucide-react';

interface MatchLogViewProps {
  matches: Match[];
  onAddMatch: (match: Match) => void;
}

const SHOT_TYPES: ShotType[] = ['Derecha', 'Revés', 'Volea', 'Bandeja', 'Víbora', 'Remate', 'Globo', 'Bajada de pared'];

const MatchLogView: React.FC<MatchLogViewProps> = ({ matches, onAddMatch }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    result: 'Victoria' as 'Victoria' | 'Derrota',
    sets: [{ myScore: '', opponentScore: '' }],
    positiveShots: [] as ShotType[],
    improvementShots: [] as ShotType[],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const toggleShot = (shot: ShotType, type: 'positive' | 'improvement') => {
    const key = type === 'positive' ? 'positiveShots' : 'improvementShots';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(shot)
        ? prev[key].filter(s => s !== shot)
        : [...prev[key], shot]
    }));
  };

  const handleSetChange = (index: number, field: 'myScore' | 'opponentScore', value: string) => {
    const newSets = [...formData.sets];
    newSets[index][field] = value;
    setFormData(prev => ({ ...prev, sets: newSets }));
  };

  const handleAddSet = () => {
    if (formData.sets.length >= 5) return; // Limit to 5 sets
    setFormData(prev => ({ ...prev, sets: [...prev.sets, { myScore: '', opponentScore: '' }] }));
  };
  
  const handleRemoveSet = (index: number) => {
    if (formData.sets.length <= 1) return;
    setFormData(prev => ({ ...prev, sets: prev.sets.filter((_, i) => i !== index) }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSets = formData.sets
      .filter(s => s.myScore !== '' && s.opponentScore !== '')
      .map(s => ({
        myScore: parseInt(s.myScore, 10),
        opponentScore: parseInt(s.opponentScore, 10),
      }));

    if (validSets.some(s => isNaN(s.myScore) || isNaN(s.opponentScore))) {
      return alert('Por favor, introduce solo números en los sets.');
    }
    
    if (validSets.length === 0) {
      return alert('Por favor, introduce el resultado de al menos un set.');
    }
    
    const newMatch: Match = {
      id: crypto.randomUUID(),
      date: formData.date,
      result: formData.result,
      positiveShots: formData.positiveShots,
      improvementShots: formData.improvementShots,
      notes: formData.notes,
      sets: validSets
    };

    onAddMatch(newMatch);
    setShowModal(false);
    setFormData({
        result: 'Victoria',
        sets: [{ myScore: '', opponentScore: '' }],
        positiveShots: [],
        improvementShots: [],
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Historial de Partidos</h2>
          <p className="text-slate-400 text-sm">Registra tus partidos para analizar tu rendimiento.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-lime-400 text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-lime-300 transition-colors"
        >
          <Plus size={20} />
          Añadir Partido
        </button>
      </div>

      <div className="grid gap-4">
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <Trophy size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500">No hay partidos registrados todavía.</p>
          </div>
        ) : (
          matches.map(m => (
            <div key={m.id} className={`p-6 rounded-2xl border ${m.result === 'Victoria' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} animate-in fade-in duration-300`}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${m.result === 'Victoria' ? 'bg-green-400 text-slate-900' : 'bg-red-400 text-slate-900'}`}>{m.result}</span>
                  <p className="text-xl font-bold">{m.sets.map(s => `${s.myScore}-${s.opponentScore}`).join(', ')}</p>
                </div>
                <p className="text-sm text-slate-400">{new Date(m.date).toLocaleDateString()}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-2"><CheckCircle size={16} /> Golpes Positivos</h4>
                  <div className="flex flex-wrap gap-2">
                    {m.positiveShots.length > 0 ? m.positiveShots.map(shot => (
                      <span key={shot} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">{shot}</span>
                    )) : <p className="text-xs text-slate-500">Ninguno</p>}
                  </div>
                </div>
                 <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-2"><AlertCircle size={16} /> Golpes a Mejorar</h4>
                  <div className="flex flex-wrap gap-2">
                    {m.improvementShots.length > 0 ? m.improvementShots.map(shot => (
                      <span key={shot} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">{shot}</span>
                    )) : <p className="text-xs text-slate-500">Ninguno</p>}
                  </div>
                </div>
              </div>
              
              {m.notes && <p className="text-sm text-slate-400 italic bg-slate-800/50 p-3 rounded-lg">"{m.notes}"</p>}
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">Registrar Partido</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Resultado</label>
                <select
                  value={formData.result}
                  onChange={e => setFormData(prev => ({ ...prev, result: e.target.value as any }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                >
                  <option value="Victoria">Victoria</option>
                  <option value="Derrota">Derrota</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Sets</label>
                <div className="space-y-3">
                  {formData.sets.map((set, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-bold w-12">Set {index + 1}</span>
                      <input
                        type="number"
                        placeholder="Yo"
                        value={set.myScore}
                        onChange={e => handleSetChange(index, 'myScore', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2 text-center focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                      />
                      <span className="text-slate-500">-</span>
                       <input
                        type="number"
                        placeholder="Rival"
                        value={set.opponentScore}
                        onChange={e => handleSetChange(index, 'opponentScore', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2 text-center focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveSet(index)}
                        disabled={formData.sets.length <= 1}
                        className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                {formData.sets.length < 5 && (
                  <button type="button" onClick={handleAddSet} className="text-lime-400 text-sm font-semibold flex items-center gap-1 hover:text-lime-300 mt-3 transition-colors">
                    <Plus size={16} /> Añadir Set
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Golpes que has sentido bien</label>
                <div className="flex flex-wrap gap-2">
                  {SHOT_TYPES.map(shot => (
                    <button
                      key={shot}
                      type="button"
                      onClick={() => toggleShot(shot, 'positive')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        formData.positiveShots.includes(shot)
                          ? 'bg-lime-400 text-slate-900 border-lime-400'
                          : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {shot}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Golpes que debes mejorar</label>
                <div className="flex flex-wrap gap-2">
                  {SHOT_TYPES.map(shot => (
                    <button
                      key={shot}
                      type="button"
                      onClick={() => toggleShot(shot, 'improvement')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        formData.improvementShots.includes(shot)
                          ? 'bg-yellow-400 text-slate-900 border-yellow-400'
                          : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {shot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Notas (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Sensaciones, momentos clave, análisis del rival..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl p-2.5 h-24 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-lime-400 text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-lime-300 transition-colors"
                >
                  Guardar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchLogView;
