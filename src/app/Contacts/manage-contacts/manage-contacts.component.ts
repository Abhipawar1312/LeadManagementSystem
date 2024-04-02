import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Contacts } from 'src/app/models/Contacts.model';
import { ContactsService } from 'src/app/service/contacts.service';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.css']
})
export class ManageContactsComponent implements OnInit {
  public dataSource!: MatTableDataSource<Contacts>;
  public Contacts!: Contacts[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['ContactID', 'LeadSource', 'LeadFor', 'LeadPriority', 'FirstName', 'LastName', 'MobileNo', 'Email', 'Address', 'Action'];
  constructor(private service: ContactsService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService) { }
  ngOnInit(): void {
    this.getContacts();
  }
  getContacts() {
    this.service.getContacts().subscribe({
      next: (res) => {
        this.Contacts = res;


        this.dataSource = new MatTableDataSource(this.Contacts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(ContactID: number) {
    this.router.navigate(['lms/updateContacts', ContactID]);
  }

  delete(ContactID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteContacts(ContactID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Deleted successfully', duration: 3000, position: 'topCenter' });
            this.getContacts();
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

}
