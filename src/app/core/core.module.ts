import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from './services/api.service';
import {BinService} from './services/bin.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [ApiService , BinService]
})
export class CoreModule {}
