export type Status = '학생' | '취업준비생' | '직장인' | '프리랜서' | '창업가' | '기타';

export interface UserProfile {
  name: string;
  birthYear: number;
  status: Status;
  major: string;
  keywords: string[];
}

export type ExperienceCategory =
  | '학업/연구'
  | '인턴/직장'
  | '창업/프로젝트'
  | '봉사/활동'
  | '해외경험'
  | '취미/자기계발'
  | '기타';

export interface Experience {
  id: string;
  title: string;
  startYear: number;
  startMonth: number;
  endYear: number | null;
  endMonth: number | null;
  isOngoing: boolean;
  description: string;
  category: ExperienceCategory;
  satisfaction: number; // 1-5
  emotions: string[];
  skills: string[];
  achievement?: string;
}

export interface StrengthItem {
  name: string;
  score: number;
  description: string;
}

export interface InterestItem {
  field: string;
  evidence: string[];
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: '쉬움' | '보통' | '어려움';
  category: string;
  resources: string[];
  completed: boolean;
}

export interface RelationNode {
  id: string;
  label: string;
  type: 'experience' | 'skill' | 'interest' | 'strength';
}

export interface RelationLink {
  source: string;
  target: string;
  strength: number;
}

export interface RelationGraph {
  nodes: RelationNode[];
  links: RelationLink[];
}

export interface AnalysisResult {
  strengths: StrengthItem[];
  interests: InterestItem[];
  problemSolvingStyle: string;
  energyDirection: string;
  actionPlans: ActionPlan[];
  summary: string;
  relationGraph: RelationGraph;
  careerSuggestions: string[];
  analysisDate: string;
}

export interface AppState {
  profile: UserProfile | null;
  experiences: Experience[];
  analysisResult: AnalysisResult | null;
}
