import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor.routing.module';
import { MonitorComponent } from './monitor.component';

@NgModule({
  declarations: [MonitorComponent],
  imports: [
    CommonModule,
    MonitorRoutingModule
  ]
})
export class MonitorModule { }
