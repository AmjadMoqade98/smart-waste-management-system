import {Component, HostBinding, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-totop',
  templateUrl: './totop.component.html',
  styleUrls: ['./totop.component.scss']
})
export class TotopComponent implements OnInit {

  show = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    try {
      const elmnt = document.getElementById('map');
      elmnt.scrollIntoView({behavior: 'smooth', block: 'start'});

    } catch {
      window.scroll(0, 0);
    }
  }
}
