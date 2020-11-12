export interface Bin {
  id?: number;
  latitude?: string;
  longitude?: number;
  status?: 'UNDER_THRESHOLD' | 'ABOUT_TO_THRESHOLD' | 'OVER_THRESHOLD' | 'EMERGENCY';
}
