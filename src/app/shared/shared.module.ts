import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {GMapModule} from 'primeng/gmap';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HoverZoomDirective} from './directives/hover-zoom.directive';
import {HoverColorDirective} from './directives/hover-color.directive';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import {CommonModule} from '@angular/common';
import {EmployeeService} from '../core/services/employee.service';
import {TableModule} from 'primeng/table';
import {MessageModule} from 'primeng/message';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessagesModule} from 'primeng/messages';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {ReportService} from '../core/services/report.service';
import {CitizenService} from '../core/services/citizen.service';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HoverZoomDirective, HoverColorDirective, SidebarComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    GMapModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
    CommonModule,
  ],
  exports: [
    ButtonModule,
    GMapModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
    HeaderComponent,
    FooterComponent,
    HoverColorDirective,
    HoverZoomDirective,
    SidebarComponent,
    TableModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    ChartModule,
    CardModule,
    PaginatorModule,
  ],

  providers: [MessageService , EmployeeService , ConfirmationService, ReportService, CitizenService]
})
// @ts-ignore
export class SharedModule { }
