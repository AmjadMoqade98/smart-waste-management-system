export interface Bin {
  id?: number;
  latitude?: string;
  longitude?: number;
  status?: 'UNDER_THRESHOLD' | 'THRESHOLD' | 'OVER_THRESHOLD' ;
}
