export interface Bin {
  id?: number;
  location?: Location ;
  status?: 'UNDER_THRESHOLD' | 'ABOUT_TO_THRESHOLD' | 'OVER_THRESHOLD' | 'EMERGENCY';
  areaId?: number;
}
