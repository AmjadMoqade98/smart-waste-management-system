import { Component, OnInit } from '@angular/core';
import {BinService} from '../../../core/services/bin.service';
import DrawingManagerOptions = google.maps.drawing.DrawingManagerOptions;
import Polygon = google.maps.Polygon;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  zoom = 14;
  lat = 31.904424;
  lng = 35.206681;
  paths = [];
  polygons: Polygon[] = [];

  constructor(private binService: BinService) {
    //this.initializeData();
  }

  // bins: Bin[];
  //
  // initializeData(): void {
  //   this.binService.getBins().subscribe(bins => {
  //     this.bins = bins;
  //     this.updatePolygon();
  //   });
  // }
  //
  // updatePolygon(): void {
  //   const newPaths = [];
  //   for (const bin of this.bins) {
  //     newPaths.push({lat: bin.location.x, lng: bin.location.y});
  //   }
  //   this.paths = newPaths;
  // }

  ngOnInit(): void {
  }

  onMapReady(map): void {
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any): void {
    const options: DrawingManagerOptions = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        position: google.maps.ControlPosition.TOP_CENTER
      },
      polygonOptions: {
        draggable: false,
        editable: false
      },
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      Swal.fire({
        title: 'do you wanna save this area ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, delete it',
      }).then((result) => {

        if (result.isConfirmed) {
          let path = [] ;
          for (const point of e.overlay.getPath().getArray()){
            path.push({lat: point.lat() , lng: point.lng()});
          }
          console.log(path);
        } else if (result.isDismissed) {
          e.overlay.setMap(null);
        }
      });
    });
  }

  polygonAction(polygon): void {
    console.log(polygon.target.getClientRects()[0]);
  }
}
// just an interface for type safety.
// tslint:disable-next-line:class-name
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

