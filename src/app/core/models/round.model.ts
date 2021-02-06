import {Location} from './location.model';

export interface Round {
   id: number;
  binIdsList: number[];
  userId: number;
  endTime: string;
  startTime: string;
  roundStatus?: 'IN_PROGRESS' | 'FINISHED';
}
