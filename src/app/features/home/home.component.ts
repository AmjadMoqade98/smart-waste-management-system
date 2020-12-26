import {Component, OnInit} from '@angular/core';
import {BinService} from '../../core/services/bin.service';
import {Bin} from '../../core/models/bin.model';
import DrawingManagerOptions = google.maps.drawing.DrawingManagerOptions;
import {ActivatedRoute} from '@angular/router';
import {share} from 'rxjs/operators';
declare const google: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.fragment.subscribe(f => {
      const element = document.querySelector('#' + f);
      if (element) { element.scrollIntoView(); }
    });
  }
}


