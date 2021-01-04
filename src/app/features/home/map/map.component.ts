import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Polygon} from '../../../core/models/polygon.model';
import MapTypeStyle = google.maps.MapTypeStyle;
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/area.service';
import {ConfirmationService} from 'primeng/api';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() bins: Bin[];
  @Input() areas: Area[];
  @Input() employees: Employee[];

  isMapInit = false;
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

  isAreaForm = false;
  isCreateArea = false;
  isUpdateArea = false;
  newArea: Area = {id: 0, polygon: null, polygonDto: {}, name: ''};
  coordinates = '';
  msg = [];

  @ViewChild('map', {static: true}) mapElement: ElementRef;
  map: google.maps.Map;

  icons =
    {
      UNDER_THRESHOLD: 'https://i.ibb.co/f8B7Y14/greenBin.png',
      ABOUT_TO_THRESHOLD: 'https://i.ibb.co/7GS3Hn1/yellow-Bin.png',
      OVER_THRESHOLD: 'https://i.ibb.co/DRRhZWM/redBin.png',
    };

  constructor(private areaService: AreaService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    if (!this.isMapInit) {
      this.initMap();
      this.isMapInit = true;
      console.log('init');
    }
  }

  ngOnChanges(): void {
    if (!this.isMapInit) {
      this.initMap();
      this.isMapInit = true;
    }
    console.log('change');
    if (this.bins && !this.isBins) {
      this.isBins = true;
      for (const bin of this.bins) {
        this.drawMarker(bin);
      }
    }
    if (this.areas && !this.isAreas) {
      this.isAreas = true;
      for (const area of this.areas) {
        this.drawPolygon(area);
      }
    }
  }

  initMap(): void {
    const map = new window.google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: {lat: 31.904424, lng: 35.206681},
      scrollwheel: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
      streetViewControl: false,
    });
    this.map = map;
    console.log(this.map);
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
        draggable: false,
        editable: false,
      }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      drawingManager.setDrawingMode(null);
      this.isUpdateArea = false;
      this.isCreateArea = true;
      polygon.setMap(null);
      this.prepareAreaForm({id: 0, polygon: null, polygonDto: {}, name: ''}, polygon);
    });

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

  prepareAreaForm(area, polygon): void {
    const arr = [];
    this.coordinates = '';
    polygon.getPath().forEach((latLng) => {
      arr.push({x: latLng.toJSON().lat, y: latLng.toJSON().lng});
    });
    arr.forEach(value => {
      this.coordinates += JSON.stringify(value) + '\n';
    });
    this.newArea = area;
    this.newArea.polygonDto.pointDtoList = arr;
    this.isAreaForm = true;
  }

  drawPolygon(area: Area): void {
    area.polygon = new google.maps.Polygon({
      paths: this.polygonToPath(area.polygonDto),
      strokeColor: '#0c0d0c',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#2f5382',
      fillOpacity: 0.2,
      draggable: true
    });
    area.polygon.setMap(this.map);
    area.polygon.addListener('click', () => {
      this.area = area;
      this.showAreaDialog();
    });
  }

  drawMarker(bin: Bin): void {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(bin.location.x, bin.location.y),
      icon: {url: this.icons[bin.status], scaledSize: new google.maps.Size(20, 20)},
      map: this.map,
    });
  }

  polygonToPath(polygon: Polygon): any[] {
    const path = [];
    for (const point of polygon.pointDtoList) {
      path.push({lat: point.x, lng: point.y});
    }
    return path;
  }

  // @ts-ignore
  calculateArea(areaId: number): void {
    const lbins: Bin[] = [];
    for (const bin of this.bins) {
      if (bin.areaId === areaId) {
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

    this.areaService.getEmployee(areaId).subscribe(employee => {
      this.currentEmployee = employee[0];
    });
  }

  assignEmployeeToArea(areaId: number, employeeId: number): void {
    if (this.currentEmployee) {
      this.areaService.unassignEmployee(areaId, this.currentEmployee.id).subscribe(value => {
        this.areaService.assignEmployee(areaId, employeeId).subscribe(value1 => {
          this.currentEmployee = this.employees.find(emp => emp.id === employeeId);
          this.msg = [{
            severity: 'success', summary: 'Confirmed',
            detail: this.currentEmployee.username + ' successfully assigned to ' + this.area.name
          }];
        });
      });
    } else {
      this.areaService.assignEmployee(areaId, employeeId).subscribe(value => {
        this.currentEmployee = this.employees.find(emp => emp.id === employeeId);
        this.msg = [{
          severity: 'success', summary: 'Confirmed',
          detail: this.currentEmployee.username + ' successfully assigned to ' + this.area.name
        }];
      });
    }
  }

  showAreaDialog(): void {
    this.calculateArea(this.area.id);
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
  }

  updateAreaPrepare(area): void {
    this.areaDialog = false;
    this.isUpdateArea = true;
    this.isCreateArea = false;
    area.polygon.setEditable(true);
    area.polygon.setDraggable(true);
    area.polygon.addListener('rightclick', () => {
      area.polygon.setEditable(false);
      area.polygon.setDraggable(false);
      this.prepareAreaForm(area, area.polygon);
    });
    this.msg = [{severity: 'info', summary: 'Note', detail: 'press right-click to save'}];
  }

  addArea(area): void {
    const area1 = {id: area.id, polygonDto: area.polygonDto, name: area.name, polygon: null};
    this.areaService.addArea(area1).subscribe(response => {
      this.areas.push(response);
      this.drawPolygon(response);
      this.msg = [{severity: 'success', summary: 'Confirmed', detail: 'area added'}];
      this.isAreaForm = false;
    });
  }

  deleteArea(area: Area): void {
    this.areaService.deleteArea(this.area.id).subscribe(value => {
      this.msg = [{severity: 'error', summary: 'Confirmed', detail: 'area deleted'}];
      this.areas = this.areas.filter(area1 => area1.id !== area.id);
      this.area.polygon.setMap(null);
    });
    this.areaDialog = false;
    this.dialogMain = false;
    this.dialogEmployees = false;
    this.dialogEmployee = false;
  }

  updateArea(area): void {
    const area1 = {id: area.id, polygonDto: area.polygonDto, name: area.name, polygon: null};
    this.areaService.updateArea(area1.id, area1).subscribe(response => {
      const index = this.areas.indexOf(this.areas.find(area2 => {
        area2.id === area1.id;
      }));
      this.areas[index] = response;
      this.areas[index].polygon = area.polygon;
      google.maps.event.clearListeners(area.polygon, 'rightclick');
      this.msg = [{severity: 'success', summary: 'Confirmed', detail: 'area updated'}];
    });
  }


  confirmDelete(area: Area): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this area?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteArea(area);
      },
    });
  }

  clearMessages(): void {
    this.msg = [];
  }
}
