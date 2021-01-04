import {Polygon} from './polygon.model';
import LatLng = google.maps.LatLng;

export interface Area{
  id?: number ;
  name?: string ;
  polygonDto: Polygon;
  polygon?;
}


