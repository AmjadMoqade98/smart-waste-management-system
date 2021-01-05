import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {AdminAuthGuard} from './core/services/auth/admin-auth-guard.service';
import {NoAuthGuard} from './core/services/auth/no-auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    // canActivate: [AdminAuthGuard]
  },
  {
    path: '', redirectTo: '/home',
    pathMatch: 'full',
    // canActivate: [AdminAuthGuard],
  },
  {
    path: 'bins',
    loadChildren: () => import('./features/bins/bins.module').then(m => m.BinsModule),
     // canActivate : [AdminAuthGuard],
  },
  {
    path: 'areas',
    loadChildren: () => import('./features/areas/areas.module').then(m => m.AreasModule),
    // canActivate : [AdminAuthGuard],
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule),
    // canActivate : [AdminAuthGuard],
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
    // canActivate : [AdminAuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    // canActivate : [NoAuthGuard],
  },
  {
    path: 'not-found',
    loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule),
    // canActivate : [NoAuthGuard],
  },

  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules, anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
