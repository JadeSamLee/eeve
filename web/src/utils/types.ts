
export interface QueryResponse {
  type: 'simple' | 'complex' | 'hybrid';
  text: string;
  visualData?: VisualData;
  loading?: boolean;
  error?: string;
}

export interface VisualData {
  clusters?: ClusterData[];
  riskScores?: RiskScore[];
  basicStats?: any; // Network statistics
}

export interface ClusterData {
  id: number;
  name: string;
  count: number;
  color: string;
  percentage?: number;
  density?: number;
}

export interface RiskScore {
  supplier: string;
  score: number;
  reasons: string[];
}

export interface SampleQuery {
  text: string;
  category: 'simple' | 'complex' | 'hybrid';
  description: string;
}
