export type FrameworkType = 
  | 'human_needs' 
  | 'jungian_libido' 
  | 'quantum_economics' 
  | 'relativity' 
  | 'cosmic_identity' 
  | 'taoist_reincarnation';

export interface ReasonItem {
  id: string;
  description: string;
  framework: FrameworkType; // The lens through which this reason was generated
  isBrainstormed: boolean; // Always true for this new mode, but kept for compatibility
}

export interface RPMCategory {
  id: string;
  name: string; // e.g., "Health & Vitality"
  outcome: string; // The "Result" user wants
  purpose: string; // The "Why" (Summary)
  reasons: ReasonItem[]; // The "Massive Reason Matrix" (Replacing Actions)
}

export interface RPMPlan {
  categories: RPMCategory[];
  dailyTop5Ids: string[]; // IDs of the top 5 most mind-blowing reasons to focus on
}

export interface CompletionState {
  [reasonId: string]: boolean;
}