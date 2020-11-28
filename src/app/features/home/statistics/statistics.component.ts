import { Component, OnInit } from '@angular/core';
import {BinService} from '../../../core/services/bin.service';
import {Bin} from '../../../core/models/bin.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  bins: Bin[];

  constructor(private binService: BinService) {
    this.initializeData();
  }

  initializeData(): void {
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
    });
  }

  ngOnInit(): void {
  }

}
