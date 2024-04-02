import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddLeadsComponent } from './Leads/add-leads/add-leads.component';
import { ManageLeadsComponent } from './Leads/manage-leads/manage-leads.component';
import { AddProductsComponent } from './Products/add-products/add-products.component';
import { ManageProductsComponent } from './Products/manage-products/manage-products.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTasksComponent } from './Tasks/add-tasks/add-tasks.component';
import { ManageTasksComponent } from './Tasks/manage-tasks/manage-tasks.component';
import { AddUsersComponent } from './Users/add-users/add-users.component';
import { ManageUsersComponent } from './Users/manage-users/manage-users.component';
import { AddContactsComponent } from './Contacts/add-contacts/add-contacts.component';
import { ManageContactsComponent } from './Contacts/manage-contacts/manage-contacts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgToastModule } from 'ng-angular-popup';
import { NgConfirmModule } from 'ng-confirm-box';
import { DatePipe } from '@angular/common';
import { NewComponent } from './LeadProgression/new/new.component';
import { WorkingComponent } from './LeadProgression/working/working.component';
import { QualifiedComponent } from './LeadProgression/qualified/qualified.component';
import { FailedComponent } from './LeadProgression/failed/failed.component';
import { ClosedComponent } from './LeadProgression/closed/closed.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    AddLeadsComponent,
    ManageLeadsComponent,
    AddProductsComponent,
    ManageProductsComponent,
    DashboardComponent,
    AddTasksComponent,
    ManageTasksComponent,
    AddUsersComponent,
    ManageUsersComponent,
    AddContactsComponent,
    ManageContactsComponent,
    NewComponent,
    WorkingComponent,
    QualifiedComponent,
    FailedComponent,
    ClosedComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    NgToastModule,
    NgConfirmModule,

  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
