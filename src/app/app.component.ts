import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SWMS';
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;

  ngOnInit() {
    this.renderMap();
  }

  renderMap() {
      this.loadMap();
    };
    if (!window.document.getElementById('google-map-script')) {
      let s = window.document.createElement('script');
      s.id = 'google-map-script';
      s.type = 'text/javascript';
      s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCEjf5CqrDWgkFb266uZ8sk3tDmnWsKPn8&amp;callback=initMap';

      window.document.body.appendChild(s);
    } else {
      this.loadMap();
    }
  }

  loadMap = () => {
    const map = new window.google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 24.5373, lng: 81.3042},
      zoom: 8
    });
  }
}


