import {AfterContentChecked, AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Polygon} from '../../../core/models/polygon.model';
import MapTypeStyle = google.maps.MapTypeStyle;
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/data/area.service';
import {ConfirmationService} from 'primeng/api';
import {TruckLocationsService} from '../../../core/services/data/truck-locations.service';
import {interval, Observable} from 'rxjs';
import {Truck} from '../../../core/models/truck.model';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() bins: Bin[];
  @Input() areas: Area[];
  @Input() employees: Employee[];
  @Input() routeParameter: any;
  truckLocations: Observable<any>;
  trucksData: Truck[];

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
  infowindow = new google.maps.InfoWindow({
    content: 'text'
  });

  icons =
    {
      UNDER_THRESHOLD: 'https://i.ibb.co/f8B7Y14/greenBin.png',
      ABOUT_TO_THRESHOLD: 'https://i.ibb.co/7GS3Hn1/yellow-Bin.png',
      OVER_THRESHOLD: 'https://i.ibb.co/DRRhZWM/redBin.png',
      EMERGENCY: 'https://i.ibb.co/HrcXKZN/emergency.png',
      TRUCK: 'https://i.ibb.co/hVQzS0m/truck.png',
    };

  constructor(private areaService: AreaService, private confirmationService: ConfirmationService,
              private truckLocationsService: TruckLocationsService) {
    this.getTruckLocations();
  }


  ngOnInit(): void {
    if (!this.isMapInit) {
      this.initMap();
      this.isMapInit = true;
    }
  }

  move(): void {
    const coor = [
      {x: 35.2013423, y: 31.887267, },
      {x: 35.2013262, y: 31.8873991, },
      {x: 35.2013181, y: 31.8874651, },
      {x: 35.2012993, y: 31.8875767, },
      {x: 35.2012832, y: 31.8876541, },
      {x: 35.2012752, y: 31.8877156, },
      {x: 35.2012497, y: 31.8877646, },
      {x: 35.2012189, y: 31.8879047, },
      {x: 35.2012055, y: 31.8879639, },
      {x: 35.2011853, y: 31.8880231, },
      {x: 35.2011592, y: 31.8880846, },
      {x: 35.2011116, y: 31.8881734, },
      {x: 35.2010982, y: 31.8882486, },
      {x: 35.2010754, y: 31.8883135, },
      {x: 35.2010425, y: 31.8883732, },
      {x: 35.2010154, y: 31.888435, },
      {x: 35.2009775, y: 31.8885241, },
      {x: 35.200956, y: 31.8886198, },
      {x: 35.2009238, y: 31.888704, },
      {x: 35.2008916, y: 31.8888156, },
      {x: 35.2008595, y: 31.8888976, },
      {x: 35.2008326, y: 31.88895, },
      {x: 35.2007629, y: 31.8890753, },
      {x: 35.2007414, y: 31.8891367, },
      {x: 35.2007254, y: 31.8891994, },
      {x: 35.2007066, y: 31.8892535, },
      {x: 35.2006556, y: 31.8893986, },
      {x: 35.2007361, y: 31.8894442, },
      {x: 35.2008246, y: 31.8894624, },
      {x: 35.2009989, y: 31.8894897, },
      {x: 35.2010794, y: 31.8894579, },
      {x: 35.2011465, y: 31.8894601, },
      {x: 35.2012417, y: 31.8894658, },
      {x: 35.2014335, y: 31.8894487, },
      {x: 35.2014147, y: 31.8895512, },
      {x: 35.2013785, y: 31.8896708, },
      {x: 35.2013604, y: 31.8897898, },
      {x: 35.201362, y: 31.8898356, },
      {x: 35.2013629, y: 31.8898767, },
      {x: 35.2013637, y: 31.8899361, },
      {x: 35.2013664, y: 31.8899839, },
      {x: 35.2013731, y: 31.8900283, },
      {x: 35.2013765, y: 31.8900961, },
      {x: 35.2013902, y: 31.8901425, },
      {x: 35.2013852, y: 31.8902003, },
      {x: 35.2014039, y: 31.8902936, },
      {x: 35.2014214, y: 31.8903813, },
      {x: 35.2014328, y: 31.8904411, },
      {x: 35.2014412, y: 31.89048469999999, },
      {x: 35.2014454, y: 31.8905508, },
      {x: 35.2014495, y: 31.8906125, },
      {x: 35.2014495, y: 31.8907138, },
      {x: 35.2014415, y: 31.8907622, },
      {x: 35.2014335, y: 31.8908584, },
      {x: 35.2014308, y: 31.8909119, },
      {x: 35.2014294, y: 31.890982, },
      {x: 35.2014207, y: 31.8910466, },
      {x: 35.2014164, y: 31.8910812, },
      {x: 35.2014142, y: 31.8911531, },
      {x: 35.2014117, y: 31.89119820000001, },
      {x: 35.2014093, y: 31.8912661, },
      {x: 35.201418, y: 31.8913059, },
      {x: 35.2014267, y: 31.8913594, },
      {x: 35.2014355, y: 31.8913879, },
      {x: 35.2014442, y: 31.8914619, },
      {x: 35.2014428, y: 31.8914972, },
      {x: 35.2014415, y: 31.8915371, },
      {x: 35.2014536, y: 31.8915929, },
      {x: 35.201465, y: 31.8916891, },
      {x: 35.2014573, y: 31.8918351, },
      {x: 35.2014641, y: 31.8919002, },
      {x: 35.2014656, y: 31.8920062, },
      {x: 35.201471, y: 31.8920666, },
      {x: 35.2014817, y: 31.8921582, },
      {x: 35.2014898, y: 31.8922132, },
      {x: 35.2015099, y: 31.8922816, },
      {x: 35.20152, y: 31.8923864, },
      {x: 35.2015277, y: 31.8924616, },
      {x: 35.2015369, y: 31.8925425, },
      {x: 35.2015402, y: 31.8925829, },
      {x: 35.2015498, y: 31.89268059999999, },
      {x: 35.20156, y: 31.8927453, },
      {x: 35.2015705, y: 31.8928415, },
      {x: 35.2015194, y: 31.8928611, },
      {x: 35.2014563, y: 31.89288, },
      {x: 35.2013792, y: 31.8928895, },
      {x: 35.2013218, y: 31.8929033, },
      {x: 35.201269, y: 31.8929148, },
      {x: 35.2012158, y: 31.8929319, },
      {x: 35.2011411, y: 31.892949, },
    ];

    let i = 0;
    setInterval(() => {
      console.log(coor[i].x + ',' + coor[i].y);

      this.truckLocationsService.setTruckLocations({truckId: 4, location: {x: coor[i].y, y: coor[i].x}});
      i++;
    }, 300);
  }

  ngOnChanges(): void {
    if (!this.isMapInit) {
      this.initMap();
      this.isMapInit = true;
    }
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

    if (this.routeParameter && this.routeParameter.bin) {
      const id = +this.routeParameter.bin;
      for (const bin of this.bins) {
        if (bin.id === id) {
          this.infowindow.open(this.map, bin.marker);
          this.infowindow.setContent(this.binToString(bin));
          if (this.map.getBounds().contains(bin.marker.getPosition())) {
            this.map.setCenter(bin.marker.getPosition());
            this.map.setZoom(16);
            this.infowindow.addListener('closeclick', () => {
              this.map.setZoom(14);
              this.map.setCenter({lat: 31.904424, lng: 35.206681});
              google.maps.event.clearListeners(this.infowindow, 'closeclick');
            });
          }
        }
      }
    }
  }

  getTruckLocations(): void {
    this.truckLocations = this.truckLocationsService.getTruckLocations();
    this.truckLocations.subscribe(trucks => {
      console.log(trucks);
      if (!this.trucksData) {
        this.trucksData = [];
        Object.keys(trucks).map((key) => {
          this.trucksData.push(trucks[key]);
        });
      } else {
        let index = 0;
        Object.keys(trucks).map((key) => {
          this.trucksData[index++].location = trucks[key].location;
        });
      }

      for (const truck of this.trucksData) {
        if (truck.marker) {
          truck.marker.setPosition(new google.maps.LatLng(truck.location.x, truck.location.y));
        } else {
          truck.marker = new google.maps.Marker({
            position: new google.maps.LatLng(truck.location.x, truck.location.y),
            icon: {url: this.icons.TRUCK, scaledSize: new google.maps.Size(40, 40)},
            map: this.map,
          });
        }
      }
    });
  }

  initMap(): void {
    const map = new window.google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: {lat: 31.904424, lng: 35.206681},
      scrollwheel: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
      streetViewControl: false,
    });
    this.map = map;
    map.addListener('click', (mapsMouseEvent) => {
      console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON()));
    });
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

  focusArea(area): void {
    this.areaDialog = false;
    this.map.fitBounds(this.getBounds(area.polygon));
  }

  getBounds = (polygon) => {
    const bounds = new google.maps.LatLngBounds();
    const paths = polygon.getPaths();
    let path;
    for (let i = 0; i < paths.getLength(); i++) {
      path = paths.getAt(i);
      for (let ii = 0; ii < path.getLength(); ii++) {
        bounds.extend(path.getAt(ii));
      }
    }
    return bounds;
  }


  drawPolygon(area: Area): void {
    area.polygon = new google.maps.Polygon({
      paths: this.polygonToPath(area.polygonDto),
      strokeColor: '#0c0d0c',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#2f5382',
      fillOpacity: 0.2,
      draggable: false
    });
    area.polygon.setMap(this.map);
    area.polygon.addListener('click', () => {
      this.area = area;
      this.showAreaDialog();
    });
  }

  drawMarker(bin: Bin): void {
    bin.marker = new google.maps.Marker({
      position: new google.maps.LatLng(bin.location.x, bin.location.y),
      icon: {url: this.icons[bin.status], scaledSize: new google.maps.Size(20, 20)},
      map: this.map,
    });
    bin.marker.addListener('click', () => {
      this.infowindow.open(this.map, bin.marker);
      this.infowindow.setContent(this.binToString(bin));
    });

  }

  binToString(bin: Bin): string {
    return 'binId: ' + bin.id + '<br />' +
      'areaId: ' + bin.areaId + '<br />' +
      'bin status: ' + bin.status;
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
      this.isAreaForm = false;
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
