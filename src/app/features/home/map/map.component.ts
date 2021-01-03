import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {BinService} from '../../../core/services/bin.service';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Polygon} from '../../../core/models/polygon.model';
import MapTypeStyle = google.maps.MapTypeStyle;
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/area.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  constructor(private areaService: AreaService) {
  }

  @Input() bins: Bin[];
  @Input() areas: Area[];
  @Input() employees: Employee[];

  isAreas = false;
  isBins = false;
  bin: Bin;

  area: Area;
  currentBins: number;
  currentUTBins: number;
  currentATBins: number;
  currentOTBins: number;
  currentEBins: number;

  areaDialog = false;
  dialogMain = true;
  dialogEmployees = false;
  dialogEmployee = false;

  currentEmployee: Employee;
  isAssign = null;


  @ViewChild('map', {static: true}) mapElement: ElementRef;
  map: google.maps.Map;

  icons =
    {
      UNDER_THRESHOLD: 'https://i.ibb.co/f8B7Y14/greenBin.png',
      ABOUT_TO_THRESHOLD: 'https://i.ibb.co/7GS3Hn1/yellow-Bin.png',
      OVER_THRESHOLD: 'https://i.ibb.co/DRRhZWM/redBin.png',
    };

  ngOnInit(): void {
    this.renderMap();
  }

  renderMap(): void {
    const map = new window.google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: {lat: 31.904424, lng: 35.206681},
      scrollwheel: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
      streetViewControl: false,
    });
    this.map = map;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#2f5382',
        fillOpacity: 0.2,
        draggable: true,
        editable: true,
      }
    });

    drawingManager.setMap(map);

    const hide: MapTypeStyle[] = [
      {
        featureType: 'poi',
        stylers: [{visibility: 'off'}],
      },
      {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [{visibility: 'off'}],
      },
    ];

    this.map.setOptions({styles: hide});
  }

  polygonToPath(polygon: Polygon): any[] {
    const path = [];
    for (const point of polygon.pointDtoList) {
      path.push({lat: point.x, lng: point.y});
    }
    return path;
  }

  ngOnChanges(): void {
    if (this.bins && !this.isBins) {
      this.isBins = true;
      for (const bin of this.bins) {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(bin.location.x, bin.location.y),
          icon: {url: this.icons[bin.status], scaledSize: new google.maps.Size(20, 20)},
          map: this.map,
        });
      }
    }
    if (this.areas && !this.isAreas) {
      this.isAreas = true;
      for (const area of this.areas) {
        const polygon = new google.maps.Polygon({
          paths: this.polygonToPath(area.polygonDto),
          strokeColor: '#0c0d0c',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#2f5382',
          fillOpacity: 0.2,
          draggable: true
        });
        polygon.setMap(this.map);
        polygon.addListener('click', () => {
          this.area = area;
          this.showAreaDialog();
        });
        polygon.addListener('overlaycomplete' , () => {
          console.log("hello");
        });
      }
    }
  }

  // @ts-ignore
  calculateArea(): void {
    const lbins: Bin[] = [];
    for (const bin of this.bins) {
      if (bin.areaId === this.area.id) {
        lbins.push(bin);
      }
    }
    this.currentBins = lbins.length;
    this.currentATBins = 0;
    this.currentOTBins = 0;
    this.currentUTBins = 0;
    this.currentEBins = 0;
    for (const bin of lbins) {
      switch (bin.status) {
        case 'UNDER_THRESHOLD': {
          this.currentUTBins++;
          break;
        }
        case 'ABOUT_TO_THRESHOLD': {
          this.currentATBins++;
          break;
        }
        case 'OVER_THRESHOLD': {
          this.currentOTBins++;
          break;
        }
        case 'EMERGENCY': {
          this.currentEBins++;
          break;
        }
      }
    }

    this.areaService.getEmployee(this.area.id).subscribe(employee => {
      this.currentEmployee = employee[0];
    });
  }

  assignEmployeeToArea(employeeId: number): void {
    if (this.currentEmployee) {
      console.log('unsign');
      this.areaService.unassignEmployee(this.area.id, this.currentEmployee.id).subscribe(value => {
        this.areaService.assignEmployee(this.area.id, employeeId).subscribe(value1 => {
          this.currentEmployee = this.employees.find(emp => emp.id === employeeId);
          this.isAssign = true;
        });
      });
    } else {
      this.areaService.assignEmployee(this.area.id, employeeId).subscribe(value => {
        this.currentEmployee = this.employees.find(emp => emp.id === employeeId);
        this.isAssign = true;
      });
    }

  }

  showAreaDialog(): void {
    this.calculateArea();
    this.areaDialog = true;
    this.dialogMain = true;
    this.dialogEmployees = false;
    this.dialogEmployee = false;
  }

  showEmployeeDialog(): void {
    this.dialogMain = false;
    this.dialogEmployees = false;
    this.dialogEmployee = true;
  }

  showEmployeesDialog(): void {
    this.dialogMain = false;
    this.dialogEmployees = true;
    this.dialogEmployee = false;
    this.isAssign = null;
  }
}
