import {Component, OnInit} from '@angular/core';
import {BinService} from '../../core/services/bin.service';
import {Bin} from '../../core/models/bin.model';

@Component({
  selector: 'app-home',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  google: any;

  zoom = 14.5;
  lat = 31.904424;
  lng = 35.206681;

  constructor(private binService: BinService) {
    this.initializeData();
  }

  bins: Bin[];

  initializeData(): void {
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
    });
  }

  ngOnInit(): void {
  }

  markerDragEnd(m: Bin, $event: google.maps.MouseEvent) {
    console.log('dragEnd', m, $event);
  }

}

// just an interface for type safety.
// tslint:disable-next-line:class-name
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

