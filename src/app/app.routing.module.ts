import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

const appRoutes: Routes = [
  {path: 'map', loadChildren: () => import('./features/map/map.module').then(m => m.MapModule)},
  {path: '', redirectTo: '/map', pathMatch: 'full'},
  {path: 'bins', loadChildren: () => import('./features/bins/bins.module').then(m => m.BinsModule)},
  { path: 'areas', loadChildren: () => import('./features/areas/areas.module').then(m => m.AreasModule) },
  { path: 'employees', loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule) },
  { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
  {path: 'login', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)},
  {path: 'register', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)},
  {path: 'not-found', loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule)},

  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
