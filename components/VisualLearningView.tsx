
import React from 'react';
import { ShotType } from '../types';
import { Youtube } from 'lucide-react';

interface LearningVideo {
  title: ShotType;
  description: string;
  youtubeId: string;
}

const learningVideos: LearningVideo[] = [
  {
    title: 'Bandeja',
    description: 'Análisis técnico de la bandeja de Paquito Navarro. Observa la preparación lateral, el punto de impacto alto y la terminación.',
    youtubeId: 'h9tLaTq92Bc',
  },
  {
    title: 'Remate',
    description: 'El remate por 3 metros de Ale Galán. Fíjate en el salto, la extensión completa del brazo y cómo busca la altura máxima.',
    youtubeId: '7Q_8Z7gJkYk',
  },
  {
    title: 'Víbora',
    description: 'La víbora de Sanyo Gutiérrez, un golpe con efecto lateral cortado. La clave está en el impacto lateral a la bola.',
    youtubeId: 'V0csm_Tz5P4',
  },
  {
    title: 'Bajada de pared',
    description: 'La bajada de pared de derecha de Fernando Belasteguín. Observa cómo espera el bote y ataca la bola en su punto más alto.',
    youtubeId: 'U_5A_d-e8fA',
  },
    {
    title: 'Volea',
    description: 'Técnica de la volea de derecha y revés por Agustín Tapia. Un golpe corto, compacto y usando el peso del cuerpo.',
    youtubeId: 'G1wA9qI2x_8',
  },
  {
    title: 'Globo',
    description: 'Cómo ejecutar un globo perfecto con Juan Lebrón. La flexión de piernas y la terminación ascendente son fundamentales.',
    youtubeId: 'Jg6vLz4X5hE',
  },
];

const VisualLearningView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <header>
        <h2 className="text-3xl font-bold mb-2">Aprendizaje Visual</h2>
        <p className="text-slate-400">Estudia la técnica de los profesionales. Analiza cada movimiento y compáralo con el tuyo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {learningVideos.map((video) => (
          <div key={video.youtubeId} className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-[1.03]">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="bg-lime-400/10 text-lime-300 px-3 py-1 rounded-full text-sm font-semibold border border-lime-400/20">{video.title}</span>
              </h3>
              <p className="text-sm text-slate-400">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualLearningView;
