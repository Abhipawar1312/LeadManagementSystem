import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Leads } from 'src/app/models/leads.model';
import { DatePipe } from '@angular/common';
import { LeadsService } from 'src/app/service/leads.service';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.css']
})
export class ClosedComponent implements OnInit {
  public dataSource!: MatTableDataSource<Leads>;
  public leads!: Leads[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['LeadID', 'LeadName', 'LeadStatus', 'LeadSource', 'CompanyName', 'CreationDate', 'ModificationDate', 'Action'];
  constructor(private service: LeadsService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.getLeads();
  }
  getLeads() {
    this.service.getLeads().subscribe({
      next: (res) => {
        this.leads = res;

        this.leads = this.leads.filter(lead => lead.LeadStatus.toLowerCase() === 'closed');

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

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);

    if (!isNaN(dateObject.getTime())) {
      return this.datePipe.transform(dateObject, 'dd-MM-yyyy') || '';
    } else {
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

  edit(LeadID: number) {
    this.router.navigate(['lms/updateLeads', LeadID]);
  }

  delete(LeadID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteLeads(LeadID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Deleted successfully', duration: 3000, position: 'topCenter' });
            this.getLeads();
          },
          error => {
            console.error('Error deleting lead:', error);
            this.toast.error({ detail: 'Error', summary: 'Failed to delete lead', duration: 3000, position: 'topCenter' });
          }
        );
      },
      () => {
        this.toast.info({ detail: 'Cancelled', summary: 'Deletion cancelled', duration: 3000, position: 'topCenter' });
      }
    );
  }
}
