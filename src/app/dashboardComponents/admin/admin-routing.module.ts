import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponentsComponent } from './components/dashboard-components/dashboard-components.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { AddLeadsComponent } from 'src/app/Leads/add-leads/add-leads.component';
import { ManageLeadsComponent } from 'src/app/Leads/manage-leads/manage-leads.component';
import { AddProductsComponent } from 'src/app/Products/add-products/add-products.component';
import { ManageProductsComponent } from 'src/app/Products/manage-products/manage-products.component';
import { AddTasksComponent } from 'src/app/Tasks/add-tasks/add-tasks.component';
import { ManageTasksComponent } from 'src/app/Tasks/manage-tasks/manage-tasks.component';
import { AddUsersComponent } from 'src/app/Users/add-users/add-users.component';
import { ManageUsersComponent } from 'src/app/Users/manage-users/manage-users.component';
import { AddContactsComponent } from 'src/app/Contacts/add-contacts/add-contacts.component';
import { ManageContactsComponent } from 'src/app/Contacts/manage-contacts/manage-contacts.component';
import { NewComponent } from 'src/app/LeadProgression/new/new.component';
import { WorkingComponent } from 'src/app/LeadProgression/working/working.component';
import { QualifiedComponent } from 'src/app/LeadProgression/qualified/qualified.component';
import { FailedComponent } from 'src/app/LeadProgression/failed/failed.component';
import { ClosedComponent } from 'src/app/LeadProgression/closed/closed.component';
import { AuthService } from 'src/app/service/auth.service';
import { roleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponentsComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'AddLeads', component: AddLeadsComponent },
      { path: 'ManageLeads', component: ManageLeadsComponent },
      // { path: 'dashboard', component: DashboardComponent, },
      // { path: 'AddLeads', component: AddLeadsComponent },
      // { path: 'ManageLeads', component: ManageLeadsComponent },
      { path: 'AddProducts', component: AddProductsComponent },
      { path: 'ManageProducts', component: ManageProductsComponent },
      { path: 'AddTasks', component: AddTasksComponent },
      { path: 'ManageTasks', component: ManageTasksComponent },
      { path: 'AddUsers', component: AddUsersComponent },
      { path: 'ManageUsers', component: ManageUsersComponent },
      { path: 'AddContacts', component: AddContactsComponent },
      { path: 'ManageContacts', component: ManageContactsComponent },
      { path: 'updateLeads/:LeadID', component: AddLeadsComponent },
      { path: 'updateProducts/:ProductID', component: AddProductsComponent },
      { path: 'updateTasks/:TaskID', component: AddTasksComponent },
      { path: 'updateUsers/:UserID', component: AddUsersComponent },
      { path: 'updateContacts/:ContactID', component: AddContactsComponent },
      { path: 'NewLeadProgression', component: NewComponent },
      { path: 'WorkingLeadProgression', component: WorkingComponent },
      { path: 'QualifiedLeadProgression', component: QualifiedComponent },
      { path: 'FailedLeadProgression', component: FailedComponent },
      { path: 'ClosedLeadProgression', component: ClosedComponent },
      // { path: '', redirectTo: '/admin/dashboard', pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
