export interface Peptide {
  id: string;
  name: string;
  dosage: number;
  unit: string; // mg, mcg, IU, etc
  frequency: string; // daily, every other day, weekly
  startDate: Date;
  endDate?: Date;
  userId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface DoseLog {
  id: string;
  peptideId: string;
  userId: string;
  dosageAmount: number;
  timestamp: Date;
  notes?: string;
}

export interface SideEffect {
  id: string;
  userId: string;
  peptideId: string;
  severity: number; // 1-5
  type: string; // fatigue, headache, nausea, etc
  notes: string;
  timestamp: Date;
}

export interface Improvement {
  id: string;
  userId: string;
  peptideId: string;
  category: string; // energy, recovery, muscle, etc
  rating: number; // 1-10
  notes: string;
  timestamp: Date;
}
