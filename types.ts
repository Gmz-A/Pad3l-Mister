
export type ShotType = 'Bandeja' | 'Víbora' | 'Remate' | 'Volea' | 'Derecha' | 'Revés' | 'Globo' | 'Bajada de pared';

export interface TrainingSession {
  id: string;
  date: string;
  shots: ShotType[];
  duration: number; // in minutes
  intensity: 'Baja' | 'Media' | 'Alta';
  notes?: string;
}

export interface AnalysisResult {
  pros: string[];
  cons: string[];
  drills: string[];
  overallScore: number;
  coachFeedback: string;
}

export interface AnalysisHistory {
  id: string;
  date: string;
  shotType: ShotType;
  videoUrl?: string;
  analysis?: AnalysisResult;
}
