export interface Bin {
  id?: number;
  latitude?: number;
  longitude?: number;
  status?: 'UNDER_THRESHOLD' | 'ABOUT_TO_THRESHOLD' | 'OVER_THRESHOLD' | 'EMERGENCY';
}
