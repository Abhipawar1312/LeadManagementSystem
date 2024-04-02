import { Component, OnInit, ViewChild } from '@angular/core';
import { LeadsService } from '../service/leads.service';
import { ProductsService } from '../service/products.service';
import { TasksService } from '../service/tasks.service';
import { UsersService } from '../service/users.service';
import { Leads } from '../models/leads.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalLeads!: number
  totalProducts!: number
  totalTasks!: number
  totalUsers!: number
  allLeads!: Leads[]
  totalNewLeads!: number
  totalWorkingLeads!: number
  totalQualifiedLeads!: number
  totalFailedLeads!: number
  totalClosedLeads!: number

  public dataSource!: MatTableDataSource<Leads>;
  public leads!: Leads[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['LeadID', 'LeadName', 'LeadStatus', 'LeadSource', 'CompanyName', 'CreationDate', 'ModificationDate'];

  constructor(private leadsservice: LeadsService, private productsService: ProductsService, private tasksService: TasksService, private usersServices: UsersService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.getLeads();
    this.TotalLeads();
    this.TotalProducts();
    this.TotalTasks();
    this.TotalUsers();
    this.TotalNewLeads();
    this.TotalWorkingLeads();
    this.TotalQualifiedLeads();
    this.TotalFailedLeads();
    this.TotalClosedLeads();
  }

  getLeads() {
    this.leadsservice.getLeads().subscribe({
      next: (res) => {
        this.leads = res;
        this.leads.forEach(lead => {
          lead.CreationDate = this.formatDate(lead.CreationDate);
          lead.ModificationDate = this.formatDate(lead.ModificationDate);
        });
        this.dataSource = new MatTableDataSource(this.leads);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  // Helper method to format dates
  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);

    if (!isNaN(dateObject.getTime())) {
      // If the conversion to Date is successful, format the date
      return this.datePipe.transform(dateObject, 'dd-MM-yyyy') || '';
    } else {
      // If the conversion fails, return an empty string or handle the error as needed
      console.error(`Invalid date string: ${dateString}`);
      return '';
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // edit(LeadID: number) {
  //   this.router.navigate(['lms/updateLeads', LeadID]);
  // }

  // delete(LeadID: number) {
  //   this.ngConfirm.showConfirm("Are you sure you want to delete?",
  //     () => {
  //       this.leadsservice.deleteLeads(LeadID).subscribe(
  //         res => {
  //           this.toast.success({ detail: 'SUCCESS', summary: 'Deleted successfully', duration: 3000, position: 'topCenter' });
  //           this.getLeads();
  //         },
  //         error => {
  //           console.error('Error deleting lead:', error);
  //           // Handle error, e.g., display an error message
  //           this.toast.error({ detail: 'Error', summary: 'Failed to delete lead', duration: 3000, position: 'topCenter' });
  //         }
  //       );
  //     },
  //     () => {
  //       // Handle cancellation, e.g., display a message
  //       this.toast.info({ detail: 'Cancelled', summary: 'Deletion cancelled', duration: 3000, position: 'topCenter' });
  //     }
  //   );
  // }

  TotalLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.totalLeads = data.length;
      }
    );
  }

  TotalProducts() {
    this.productsService.getproducts().subscribe(
      (data) => {
        this.totalProducts = data.length;
      }
    );
  }

  TotalTasks() {
    this.tasksService.getTasks().subscribe(
      (data) => {
        this.totalTasks = data.length;
      }
    );
  }

  TotalUsers() {
    this.usersServices.getUsers().subscribe(
      (data) => {
        this.totalUsers = data.length;
      }
    );
  }

  TotalNewLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.allLeads = data;
        this.totalNewLeads = this.allLeads.filter(lead => lead.LeadStatus.toLowerCase() === 'new').length;
      }
    );
  }

  TotalWorkingLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.allLeads = data;
        this.totalWorkingLeads = this.allLeads.filter(lead => lead.LeadStatus.toLowerCase() === 'working').length;
      }
    );
  }

  TotalQualifiedLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.allLeads = data;
        this.totalQualifiedLeads = this.allLeads.filter(lead => lead.LeadStatus.toLowerCase() === 'qualified').length;
      }
    );
  }

  TotalFailedLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.allLeads = data;
        this.totalFailedLeads = this.allLeads.filter(lead => lead.LeadStatus.toLowerCase() === 'failed').length;
      }
    );
  }

  TotalClosedLeads() {
    this.leadsservice.getLeads().subscribe(
      (data) => {
        this.allLeads = data;
        this.totalClosedLeads = this.allLeads.filter(lead => lead.LeadStatus.toLowerCase() === 'closed').length;
      }
    );
  }

}

