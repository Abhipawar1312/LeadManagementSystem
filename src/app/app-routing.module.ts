import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { NewComponent } from './LeadProgression/new/new.component';
import { WorkingComponent } from './LeadProgression/working/working.component';
import { QualifiedComponent } from './LeadProgression/qualified/qualified.component';
import { FailedComponent } from './LeadProgression/failed/failed.component';
import { ClosedComponent } from './LeadProgression/closed/closed.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './service/auth.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'lms',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboardComponents/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'Dashboard', component: DashboardComponent },
  // { path: 'AddLeads', component: AddLeadsComponent },
  // { path: 'ManageLeads', component: ManageLeadsComponent },
  // { path: 'AddProducts', component: AddProductsComponent },
  // { path: 'ManageProducts', component: ManageProductsComponent },
  // { path: 'AddTasks', component: AddTasksComponent },
  // { path: 'ManageTasks', component: ManageTasksComponent },
  // { path: 'AddUsers', component: AddUsersComponent },
  // { path: 'ManageUsers', component: ManageUsersComponent },
  // { path: 'AddContacts', component: AddContactsComponent },
  // { path: 'ManageContacts', component: ManageContactsComponent },
  // { path: 'updateLeads/:LeadID', component: AddLeadsComponent },
  // { path: 'updateProducts/:ProductID', component: AddProductsComponent },
  // { path: 'updateTasks/:TaskID', component: AddTasksComponent },
  // { path: 'updateUsers/:UserID', component: AddUsersComponent },
  // { path: 'updateContacts/:ContactID', component: AddContactsComponent },
  // { path: 'NewLeadProgression', component: NewComponent },
  // { path: 'WorkingLeadProgression', component: WorkingComponent },
  // { path: 'QualifiedLeadProgression', component: QualifiedComponent },
  // { path: 'FailedLeadProgression', component: FailedComponent },
  // { path: 'ClosedLeadProgression', component: ClosedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
