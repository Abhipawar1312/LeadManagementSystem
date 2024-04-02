import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Leads } from 'src/app/models/leads.model';
import { DatePipe } from '@angular/common';
import { LeadsService } from 'src/app/service/leads.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.css']
})
export class ManageLeadsComponent implements OnInit {
  public dataSource!: MatTableDataSource<Leads>;
  public leads!: Leads[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['LeadID', 'LeadName', 'LeadStatus', 'LeadSource', 'CompanyName', 'CreationDate', 'ModificationDate', 'Action'];
  constructor(private service: LeadsService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private datePipe: DatePipe, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getLeads();
  }
  getLeads() {
    this.service.getLeads().subscribe({
      next: (res) => {
        console.log(res);
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

  edit(LeadID: number) {
    this.router.navigate(['lms/updateLeads', LeadID]);
  }

  delete(LeadID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteLeads(LeadID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Lead Deleted successfully', duration: 3000, position: 'topCenter' });
            this.getLeads();
          },
          error => {
            console.error('Error deleting lead:', error);
            // Handle error, e.g., display an error message
            this.toast.error({ detail: 'Error', summary: 'Failed to delete lead', duration: 3000, position: 'topCenter' });
          }
        );
      },
      () => {
        // Handle cancellation, e.g., display a message
        this.toast.info({ detail: 'Cancelled', summary: 'Deletion cancelled', duration: 3000, position: 'topCenter' });
      }
    );
  }

  importFromExcel(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse the sheet data into an array of objects
      const leadsData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains headers, so skipping it
      const headers: string[] = (leadsData.shift() as string[]) || [];

      const parsedLeads = leadsData.map((lead: any) => {
        const leadObject: any = {};
        headers.forEach((header: string, index: number) => {
          leadObject[header] = lead[index];
        });
        return leadObject;
      });

      // Now 'parsedLeads' contains the imported data
      console.log(parsedLeads);

      // Update the data source and trigger change detection
      this.leads = parsedLeads;
      this.dataSource = new MatTableDataSource(this.leads);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Trigger change detection
      this.cdr.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }

  exportToExcel(): void {
    const data = this.leads.map((lead) => {
      return {
        LeadID: lead.LeadID,
        LeadName: lead.LeadName,
        LeadStatus: lead.LeadStatus,
        LeadSource: lead.LeadSource,
        CompanyName: lead.CompanyName,
        CreationDate: lead.CreationDate,
        ModificationDate: lead.ModificationDate,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'leads.xlsx');
  }

}
