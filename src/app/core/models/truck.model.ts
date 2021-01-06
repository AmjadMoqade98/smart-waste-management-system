import {Location} from './location.model';

export interface Truck {
  id: number;
  number?: string;
  marker?: any;
  location?: Location;
}
