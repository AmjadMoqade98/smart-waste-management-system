import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';


const appRoutes: Routes = [
  {path: 'bins', loadChildren: () => import('./features/bins/bins.module').then(m => m.BinsModule)},
  {path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)},
  {path: '', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)},
  {path: 'not-found', loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule)},
  { path: 'areas', loadChildren: () => import('./features/areas/areas.module').then(m => m.AreasModule) },
  { path: 'employees', loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule) },
  { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}

];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
