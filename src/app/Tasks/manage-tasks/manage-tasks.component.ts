import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { DatePipe } from '@angular/common';
import { Tasks } from 'src/app/models/Tasks.model';
import { TasksService } from 'src/app/service/tasks.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrls: ['./manage-tasks.component.css']
})
export class ManageTasksComponent implements OnInit {
  public dataSource!: MatTableDataSource<Tasks>;
  public Tasks!: Tasks[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['TaskID', 'TaskTitle', 'AssignedTo', 'StartDate', 'DueDate', 'Action'];
  constructor(private service: TasksService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private datePipe: DatePipe, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getLeads();
  }
  getLeads() {
    this.service.getTasks().subscribe({
      next: (res) => {
        this.Tasks = res;

        // Format CreationDate and ModificationDate
        this.Tasks.forEach(Tasks => {
          Tasks.StartDate = this.formatDate(Tasks.StartDate);
          Tasks.DueDate = this.formatDate(Tasks.DueDate);
        });

        this.dataSource = new MatTableDataSource(this.Tasks);
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

  edit(TaskID: number) {
    this.router.navigate(['lms/updateTasks', TaskID]);
  }

  delete(TaskID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteTasks(TaskID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Task Deleted successfully ✔️', duration: 3000, position: 'topCenter' });
            this.getLeads();
          },
          error => {
            console.error('Error deleting lead:', error);
            // Handle error, e.g., display an error message
            this.toast.error({ detail: 'Error', summary: 'Failed to delete Task', duration: 3000, position: 'topCenter' });
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
      const tasksData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains headers, so skipping it
      const headers: string[] = (tasksData.shift() as string[]) || [];

      const parsedtasks = tasksData.map((task: any) => {
        const taskObject: any = {};
        headers.forEach((header: string, index: number) => {
          taskObject[header] = task[index];
        });
        return taskObject;
      });

      // Now 'parsedLeads' contains the imported data
      console.log(parsedtasks);

      // Update the data source and trigger change detection
      this.Tasks = parsedtasks;
      this.dataSource = new MatTableDataSource(this.Tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Trigger change detection
      this.cdr.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }

  exportToExcel(): void {
    const data = this.Tasks.map((Tasks) => {
      return {
        TaskID: Tasks.TaskID,
        TaskTitle: Tasks.TaskTitle,
        AssignedTo: Tasks.AssignedTo,
        StartDate: Tasks.StartDate,
        DueDate: Tasks.DueDate,

      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'Tasks.xlsx');
  }
}
