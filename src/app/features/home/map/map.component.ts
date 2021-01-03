import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BinService} from '../../../core/services/bin.service';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() bins: Bin[];
  @Input() areas: Area[];

  @ViewChild('map', {static: true }) mapElement: ElementRef;
  map: google.maps.Map;

  ngOnInit(): void {
    this.renderMap();
  }
  constructor(private binService: BinService) {
  }
  renderMap(): void {
    const map = new window.google.maps.Map(this.mapElement.nativeElement, {
      zoom: 5,
      center: {lat: 24.886, lng: -70.268},
      mapTypeId: 'roadmap'
    });
    this.map = map;
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

