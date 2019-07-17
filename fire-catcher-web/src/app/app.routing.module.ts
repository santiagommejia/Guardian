import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'monitor'},
  {path: 'login', loadChildren: './pages/login/login.module#LoginModule'},
  {path: 'monitor', loadChildren: './pages/monitor/monitor.module#MonitorModule', canActivate: [AuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
