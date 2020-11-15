import {Component, OnInit} from '@angular/core';
import {BinService} from '../../core/services/bin.service';
import {Bin} from '../../core/models/bin.model';
import DrawingManagerOptions = google.maps.drawing.DrawingManagerOptions;
declare const google: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
  }
  ngOnInit(): void {
  }
}


