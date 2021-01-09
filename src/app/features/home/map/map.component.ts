import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Polygon} from '../../../core/models/polygon.model';
import MapTypeStyle = google.maps.MapTypeStyle;
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/data/area.service';
import {ConfirmationService} from 'primeng/api';
import {TruckLocationsService} from '../../../core/services/data/truck-locations.service';
import {Truck} from '../../../core/models/truck.model';
import {TruckService} from '../../../core/services/data/truck.service';
import {BinService} from '../../../core/services/data/bin.service';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {TruckLocation} from '../../../core/models/truck-location.model';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css', '../../../../assets/styles/primeNG.scss']
})
export class MapComponent implements OnInit {
  @Input() routeParameter: any;

  bins: Bin[];
  areas: Area[];
  employees: Employee[];
  freeEmployees: Employee[];
  truckLocations: TruckLocation[];
  trucks: Truck[];

  freeTrucks: number;
  isMapInit = false;
  bin: Bin;

  area: Area;
  currentBins: number;

  areaDialog = false;
  dialogMain = true;
  dialogEmployees = false;
  dialogEmployee = false;
  areaInfo = [];
  employeeInfo = [];

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
              private truckLocationsService: TruckLocationsService, private truckService: TruckService,
              private binService: BinService, private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.initMap();
    this.initializeData();
    this.handleRouteParameters();
    this.isMapInit = true;
  }

  initializeData(): void {
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
      for (const bin of this.bins) {
        this.renderBin(bin);
      }
    });

    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.freeEmployees = this.employees.filter(employee => employee.areaIdsList.length === 0);

      this.areaService.getAreas().subscribe(areas => {
        this.areas = areas;
        for (const area of this.areas) {
          this.renderArea(area);
        }
      });
      this.truckService.getTrucks().subscribe(trucks => {
        this.trucks = trucks;
        this.renderTrucks();
      });
    });
  }

  // move(): void {
  //   const coor = [
  //     {x: 35.2013423, y: 31.887267,},
  //     {x: 35.2013262, y: 31.8873991,},
  //     {x: 35.2013181, y: 31.8874651,},
  //     {x: 35.2012993, y: 31.8875767,},
  //     {x: 35.2012832, y: 31.8876541,},
  //     {x: 35.2012752, y: 31.8877156,},
  //     {x: 35.2012497, y: 31.8877646,},
  //     {x: 35.2012189, y: 31.8879047,},
  //     {x: 35.2012055, y: 31.8879639,},
  //     {x: 35.2011853, y: 31.8880231,},
  //     {x: 35.2011592, y: 31.8880846,},
  //     {x: 35.2011116, y: 31.8881734,},
  //     {x: 35.2010982, y: 31.8882486,},
  //     {x: 35.2010754, y: 31.8883135,},
  //     {x: 35.2010425, y: 31.8883732,},
  //     {x: 35.2010154, y: 31.888435,},
  //     {x: 35.2009775, y: 31.8885241,},
  //     {x: 35.200956, y: 31.8886198,},
  //     {x: 35.2009238, y: 31.888704,},
  //     {x: 35.2008916, y: 31.8888156,},
  //     {x: 35.2008595, y: 31.8888976,},
  //     {x: 35.2008326, y: 31.88895,},
  //     {x: 35.2007629, y: 31.8890753,},
  //     {x: 35.2007414, y: 31.8891367,},
  //     {x: 35.2007254, y: 31.8891994,},
  //     {x: 35.2007066, y: 31.8892535,},
  //     {x: 35.2006556, y: 31.8893986,},
  //     {x: 35.2007361, y: 31.8894442,},
  //     {x: 35.2008246, y: 31.8894624,},
  //     {x: 35.2009989, y: 31.8894897,},
  //     {x: 35.2010794, y: 31.8894579,},
  //     {x: 35.2011465, y: 31.8894601,},
  //     {x: 35.2012417, y: 31.8894658,},
  //     {x: 35.2014335, y: 31.8894487,},
  //     {x: 35.2014147, y: 31.8895512,},
  //     {x: 35.2013785, y: 31.8896708,},
  //     {x: 35.2013604, y: 31.8897898,},
  //     {x: 35.201362, y: 31.8898356,},
  //     {x: 35.2013629, y: 31.8898767,},
  //     {x: 35.2013637, y: 31.8899361,},
  //     {x: 35.2013664, y: 31.8899839,},
  //     {x: 35.2013731, y: 31.8900283,},
  //     {x: 35.2013765, y: 31.8900961,},
  //     {x: 35.2013902, y: 31.8901425,},
  //     {x: 35.2013852, y: 31.8902003,},
  //     {x: 35.2014039, y: 31.8902936,},
  //     {x: 35.2014214, y: 31.8903813,},
  //     {x: 35.2014328, y: 31.8904411,},
  //     {x: 35.2014412, y: 31.89048469999999,},
  //     {x: 35.2014454, y: 31.8905508,},
  //     {x: 35.2014495, y: 31.8906125,},
  //     {x: 35.2014495, y: 31.8907138,},
  //     {x: 35.2014415, y: 31.8907622,},
  //     {x: 35.2014335, y: 31.8908584,},
  //     {x: 35.2014308, y: 31.8909119,},
  //     {x: 35.2014294, y: 31.890982,},
  //     {x: 35.2014207, y: 31.8910466,},
  //     {x: 35.2014164, y: 31.8910812,},
  //     {x: 35.2014142, y: 31.8911531,},
  //     {x: 35.2014117, y: 31.89119820000001,},
  //     {x: 35.2014093, y: 31.8912661,},
  //     {x: 35.201418, y: 31.8913059,},
  //     {x: 35.2014267, y: 31.8913594,},
  //     {x: 35.2014355, y: 31.8913879,},
  //     {x: 35.2014442, y: 31.8914619,},
  //     {x: 35.2014428, y: 31.8914972,},
  //     {x: 35.2014415, y: 31.8915371,},
  //     {x: 35.2014536, y: 31.8915929,},
  //     {x: 35.201465, y: 31.8916891,},
  //     {x: 35.2014573, y: 31.8918351,},
  //     {x: 35.2014641, y: 31.8919002,},
  //     {x: 35.2014656, y: 31.8920062,},
  //     {x: 35.201471, y: 31.8920666,},
  //     {x: 35.2014817, y: 31.8921582,},
  //     {x: 35.2014898, y: 31.8922132,},
  //     {x: 35.2015099, y: 31.8922816,},
  //     {x: 35.20152, y: 31.8923864,},
  //     {x: 35.2015277, y: 31.8924616,},
  //     {x: 35.2015369, y: 31.8925425,},
  //     {x: 35.2015402, y: 31.8925829,},
  //     {x: 35.2015498, y: 31.89268059999999,},
  //     {x: 35.20156, y: 31.8927453,},
  //     {x: 35.2015705, y: 31.8928415,},
  //     {x: 35.2015194, y: 31.8928611,},
  //     {x: 35.2014563, y: 31.89288,},
  //     {x: 35.2013792, y: 31.8928895,},
  //     {x: 35.2013218, y: 31.8929033,},
  //     {x: 35.201269, y: 31.8929148,},
  //     {x: 35.2012158, y: 31.8929319,},
  //     {x: 35.2011411, y: 31.892949,},
  //   ];
  //
  //   let i = 0;
  //   setInterval(() => {
  //     console.log(coor[i].x + ',' + coor[i].y);
  //
  //     this.truckLocationsService.setTruckLocations({truckId: 4, location: {x: coor[i].y, y: coor[i].x}});
  //     i++;
  //   }, 300);
  // }


  handleRouteParameters(): void {
    if (this.routeParameter) {
      if (this.routeParameter.binId) {
        const id = +this.routeParameter.binId;
        if (this.bins) {
          for (const bin of this.bins) {
            if (bin.id === id) {
              this.infowindow.open(this.map, bin.marker);
              this.infowindow.setContent(this.binToString(bin));
              this.map.setCenter(bin.marker.getPosition());
              this.map.setZoom(16);
              this.infowindow.addListener('closeclick', () => {
                this.map.setZoom(14);
                this.map.setCenter({lat: bin.location.x, lng: bin.location.y});
                google.maps.event.clearListeners(this.infowindow, 'closeclick');
              });
            }
          }
        }
      }
      if (this.routeParameter.truckId) {
        const id = +this.routeParameter.truckId;
        if (this.truckLocations) {
          for (const truck of this.truckLocations) {
            if (truck.truckId === id) {
              this.map.setZoom(16);
              this.map.setCenter({lat: truck.location.x, lng: truck.location.y});
            }
          }
        }
      }
    }
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
  };

  renderArea(area: Area): void {
    if (area.polygon) {
      area.polygon.setMap(null);
    }
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

  renderBin(bin: Bin): void {
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

  renderTrucks(): void {
    this.freeTrucks = 0;
    this.truckLocationsService.getTruckLocations().subscribe(trucks => {
      this.clearTrucks();
      Object.keys(trucks).map((key) => {
        this.truckLocations.push(trucks[key]);
      });
      for (const truck of this.truckLocations) {
        const truckModel = this.trucks.find(value => value.id === truck.truckId);
        if (truckModel) {
          truck.marker = new google.maps.Marker({
            position: new google.maps.LatLng(truck.location.x, truck.location.y),
            icon: {url: this.icons.TRUCK, scaledSize: new google.maps.Size(40, 40)},
            map: this.map,
          });
          let markerContent = '';
          if (truckModel.employees && truckModel.employees.length > 0) {
            const truckEmp = this.employees.find(value => value.id === truckModel.employees[0]);
            markerContent = 'Employee : ' + truckEmp.username;
          } else {
            this.freeTrucks++;
            markerContent = this.freeTrucks + '  free trucks';
          }
          truck.marker.addListener('click', () => {
            this.infowindow.open(this.map, truck.marker);
            this.infowindow.setContent(markerContent);
          });
        }
      }
    });
  }

  clearTrucks(): void {
    if (this.truckLocations && this.truckLocations.length > 0) {
      for (const truck of this.truckLocations) {
        if (truck.marker) {
          truck.marker.setMap(null);
        }
      }
    }
    this.truckLocations = [];
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

  calculateArea(areaId: number): void {
    const lbins: Bin[] = [];
    for (const bin of this.bins) {
      if (bin.areaId === areaId) {
        lbins.push(bin);
      }
    }
    this.currentBins = lbins.length;
    let currentATBins = 0;
    let currentOTBins = 0;
    let currentUTBins = 0;
    let currentEBins = 0;
    for (const bin of lbins) {
      switch (bin.status) {
        case 'UNDER_THRESHOLD': {
          currentUTBins++;
          break;
        }
        case 'ABOUT_TO_THRESHOLD': {
          currentATBins++;
          break;
        }
        case 'OVER_THRESHOLD': {
          currentOTBins++;
          break;
        }
        case 'EMERGENCY': {
          currentEBins++;
          break;
        }
      }
      this.areaInfo = [
        {label: 'total bins', value: lbins.length},
        {label: 'under threshold bins', value: currentUTBins},
        {label: 'about threshold bins', value: currentATBins},
        {label: 'over threshold bins', value: currentOTBins},
        {label: 'Emergency bins', value: currentEBins},
      ];
    }

    this.areaService.getEmployee(areaId).subscribe(employee => {
      this.currentEmployee = employee[0];
      console.log(this.currentEmployee);
      if (this.currentEmployee) {
        this.employeeInfo = [
          {label: 'username', value: this.currentEmployee.username},
          {label: 'first name', value: this.currentEmployee.firstName},
          {label: 'last name', value: this.currentEmployee.lastName},
          {label: 'phone', value: this.currentEmployee.phone},
          {label: 'address', value: this.currentEmployee.address},
        ];
      }

    });
  }

  assignEmployeeToArea(area: Area, employee: Employee): void {
    if (this.currentEmployee) {
      this.areaService.unassignEmployee(area.id, this.currentEmployee.id).subscribe();
      this.areaService.assignEmployee(area.id, employee.id).subscribe(value1 => {
        this.currentEmployee = this.employees.find(emp => emp.id === employee.id);
        this.msg = [{
          severity: 'success', summary: 'Confirmed',
          detail: this.currentEmployee.username + ' successfully assigned to ' + this.area.name
        }];
        this.employeeService.refreshEmployees();
      });
      const vehicleId = this.currentEmployee.vehicleId;
      this.truckService.unassignEmployee(vehicleId, this.currentEmployee.id).subscribe(value => {
        this.truckService.assignEmployee(vehicleId, employee.id).subscribe();
      });

    } else {
      let freeTruck;
      for (const truck of this.trucks) {
        if (!truck.employees || truck.employees.length === 0) {
          freeTruck = truck;
        }
      }
      if (freeTruck) {
        this.areaService.assignEmployee(area.id, employee.id).subscribe(value => {
          this.employees.find(emp => emp.id === employee.id).areaIdsList = [area.id];
          this.currentEmployee = this.employees.find(emp => emp.id === employee.id);
          this.msg = [{
            severity: 'success', summary: 'Confirmed',
            detail: this.currentEmployee.username + ' successfully assigned to ' + this.area.name
          }];
        });
        this.truckService.assignEmployee(freeTruck.id, employee.id).subscribe(value => {
          this.employees.find(emp => emp.id === employee.id).vehicleId = freeTruck.id;
          this.currentEmployee = this.employees.find(emp => emp.id === employee.id);
        });
      } else {
        this.msg = [{severity: 'error', summary: 'Error!', detail: 'There is no any available trukcs'}];
      }
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
      this.renderArea(response);
      this.msg = [{severity: 'success', summary: 'Confirmed', detail: 'area added'}];
      this.isAreaForm = false;
    });
  }

  deleteArea(area: Area): void {
    this.area.polygon.setMap(null);
    area.polygon.setMap(null);
    this.areaService.deleteArea(area.id).subscribe(value => {
      this.msg = [{severity: 'error', summary: 'Confirmed', detail: 'area deleted'}];
      this.areas = this.areas.filter(area1 => area1.id !== area.id);
    }, error => {
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

  deleteAreaEmployee(area: Area): void {
    this.areaService.unassignEmployee(area.id, this.currentEmployee.id).subscribe(value => {
      this.currentEmployee = null;
      this.msg = [{severity: 'success', summary: 'Confirmed', detail: 'employee unassigned'}];
    });
    this.truckService.unassignEmployee(this.currentEmployee.vehicleId, this.currentEmployee.id).subscribe();
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


