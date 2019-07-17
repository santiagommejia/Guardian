import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MonitorRoutingModule } from './monitor.routing.module';
import { MonitorComponent } from './monitor.component';

@NgModule({
  declarations: [MonitorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    MonitorRoutingModule
  ]
})
export class MonitorModule { }
