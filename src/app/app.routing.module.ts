import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {AdminAuthGuard} from './core/services/auth/admin-auth-guard.service';
import {NoAuthGuard} from './core/services/auth/no-auth-guard.service';
import {MatcherService} from './core/services/Matcher.service';
import {BinsComponent} from './features/data/bins/bins.component';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    canActivate: [AdminAuthGuard]
  },

  { path: 'data',
    loadChildren: () => import('./features/data/data.module').then(m => m.DataModule),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate : [NoAuthGuard],
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { anchorScrolling: 'enabled' , useHash: true})],
  exports: [RouterModule],
  providers: [MatcherService]
})
export class AppRoutingModule {
}
