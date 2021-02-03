import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HoverZoomDirective} from './directives/hover-zoom.directive';
import {HoverColorDirective} from './directives/hover-color.directive';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {CommonModule, DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {MessageModule} from 'primeng/message';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessagesModule} from 'primeng/messages';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {PasswordModule} from 'primeng/password';
import {DropdownModule} from 'primeng/dropdown';
import {KeyFilterModule} from 'primeng/keyfilter';
import {TabMenuModule} from 'primeng/tabmenu';
import {RippleModule} from 'primeng/ripple';
import {CrystalLightboxModule} from '@crystalui/angular-lightbox';
import {CalendarModule} from 'primeng/calendar';
import {LoadingBarComponent} from './components/loading-bar/loading-bar.component';
import {TotopComponent} from './components/totop/totop.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HoverZoomDirective,
    HoverColorDirective,
    SidebarComponent,
    LoadingBarComponent,
    TotopComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CommonModule,
  ],
  exports: [
    ReactiveFormsModule,
    ButtonModule,
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
    PasswordModule,
    DropdownModule,
    KeyFilterModule,
    TabMenuModule,
    RippleModule,
    CrystalLightboxModule,
    CalendarModule,
    LoadingBarComponent,
    TotopComponent,
  ],

  providers: [MessageService, ConfirmationService, DatePipe]
})
// @ts-ignore
export class SharedModule {
}
