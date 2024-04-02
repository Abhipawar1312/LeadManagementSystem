import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponentsComponent } from './components/dashboard-components/dashboard-components.component';
import { NgToastModule } from 'ng-angular-popup';
import { NgConfirmModule } from 'ng-confirm-box';


@NgModule({
  declarations: [
    DashboardComponentsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgToastModule,
    NgConfirmModule,
  ]
})
export class AdminModule { }
