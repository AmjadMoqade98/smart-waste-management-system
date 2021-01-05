import {Component, OnInit} from '@angular/core';
import {BinService} from '../../core/services/data/bin.service';
import {Bin} from '../../core/models/bin.model';


@Component({
  selector: 'app-bins',
  templateUrl: './bins.component.html',
  styleUrls: ['./bins.component.scss']
})
export class BinsComponent implements OnInit {

  constructor(private binService: BinService) {
    this.initializeData();
  }

  bins: Bin[];

  initializeData(): void{
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
    });
  }

  ngOnInit(): void {
  }

}
