import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Users } from 'src/app/models/Users.model';
import { UsersService } from 'src/app/service/users.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  public dataSource!: MatTableDataSource<Users>;
  public Users!: Users[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['UserID', 'UserName', 'Password', 'Email', 'FirstName', 'LastName', 'DateofBirth', 'PhoneNo', 'MobileNo', 'UserRole', 'Image', 'Action'];
  constructor(private service: UsersService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.service.getUsers().subscribe({
      next: (res) => {
        this.Users = res;
        this.dataSource = new MatTableDataSource(this.Users);
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

  edit(UserID: number) {
    this.router.navigate(['lms/updateUsers', UserID]);
  }

  delete(UserID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteUsers(UserID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Deleted successfully', duration: 3000, position: 'topCenter' });
            this.getUsers();
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
      const UsersData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains headers, so skipping it
      const headers: string[] = (UsersData.shift() as string[]) || [];

      const parsedUsers = UsersData.map((User: any) => {
        const UserObject: any = {};
        headers.forEach((header: string, index: number) => {
          UserObject[header] = User[index];
        });
        return UserObject;
      });

      // Now 'parsedLeads' contains the imported data
      console.log(parsedUsers);

      // Update the data source and trigger change detection
      this.Users = parsedUsers;
      this.dataSource = new MatTableDataSource(this.Users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Trigger change detection
      this.cdr.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }

  exportToExcel(): void {
    const data = this.Users.map((User) => {
      return {
        UserID: User.UserID,
        UserName: User.UserName,
        Password: User.Password,
        Email: User.Email,
        FirstName: User.FirstName,
        LastName: User.LastName,
        DateofBirth: User.DateofBirth,
        PhoneNo: User.PhoneNo,
        MobileNo: User.MobileNo,
        UserRole: User.UserRole,
        Image: User.Image,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'Users.xlsx');
  }
}
