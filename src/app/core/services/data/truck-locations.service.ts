import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable, ReplaySubject} from 'rxjs';
import {TruckLocation} from '../../models/truck-location.model';
import {shareReplay} from 'rxjs/operators';

@Injectable()
export class TruckLocationsService{
  ref: any;
  list;
  private truckLocations: ReplaySubject<TruckLocation[]> = new ReplaySubject<any>(1);

  constructor(private db: AngularFireDatabase) {
    this.list = db.list('/truck-locations');
    this.ref = db.database.ref('/truck-locations');
    this.ref.on('value' , (trucks) => {
      this.truckLocations.next(trucks.val());
    });
  }
  getTruckLocations(): Observable<TruckLocation[]> {
    return this.truckLocations.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  setTruckLocations(truckLocation: TruckLocation): void {
    this.ref.child(truckLocation.truckId).set(truckLocation);
  }
}
