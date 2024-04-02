import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/service/tasks.service';
import { Tasks } from 'src/app/models/Tasks.model';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {
  public TasksForm!: FormGroup;
  public TaskIdToUpdate!: number;
  public isUpdateActive: boolean = false;


  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: TasksService,
    private router: Router,
    private toastService: NgToastService,
  ) {
    this.TasksForm = this.fb.group({
      TaskID: [''],
      TaskTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      AssignedTo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      StartDate: ['', Validators.required],
      DueDate: ['', Validators.required],
    });
    console.log('FormGroup:', this.TasksForm);
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(val => {
      this.TaskIdToUpdate = val['TaskID'];
      if (this.TaskIdToUpdate) {
        this.isUpdateActive = true;
        this.service.getTasksId(this.TaskIdToUpdate).subscribe(res => {
          this.fillFormToUpdate(res);
        });
      }
    })
  }

  submit() {
    if (this.TasksForm.valid) {
      this.service.postTasks(this.TasksForm.value).subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Task Added Successfully ✔️', duration: 5000, position: 'topCenter' });
        this.TasksForm.reset();
        this.router.navigate(['lms/ManageTasks']);
      });
    } else {

      const taskTitleControl = this.TasksForm.get('TaskTitle');
      const assignedToControl = this.TasksForm.get('AssignedTo');

      if (taskTitleControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Task Title should have a minimum length of 3 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (taskTitleControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Task Title should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else {
        this.toastService.error({ detail: 'ERROR', summary: 'All fields are compulsory', duration: 5000, position: 'topCenter' });
      }
    }
  }

  update() {
    console.log(this.TasksForm.value);
    this.service.updateTasks(this.TasksForm.value, this.TaskIdToUpdate)
      .subscribe(res => {
        console.log(res);
        this.toastService.success({ detail: 'SUCCESS', summary: 'Task Updated Successfully ✔️', duration: 3000, position: 'topCenter' });
        this.router.navigate(['lms/ManageTasks']);
        this.TasksForm.reset();
      });
  }

  fillFormToUpdate(TaskResponse: any[] | Tasks) {
    if (Array.isArray(TaskResponse) && TaskResponse.length > 0) {
      const TaskData = TaskResponse[0];
      console.log('Filling form with Lead:', TaskData);
      this.TasksForm.patchValue({
        TaskID: TaskData.TaskID,
        TaskTitle: TaskData.TaskTitle,
        AssignedTo: TaskData.AssignedTo,
        StartDate: TaskData.StartDate,
        DueDate: TaskData.DueDate,

      });
    } else if (!Array.isArray(TaskResponse)) {
      console.log('Filling form with Lead:', TaskResponse);
      this.TasksForm.patchValue({
        TaskID: TaskResponse.TaskID,
        TaskTitle: TaskResponse.TaskTitle,
        AssignedTo: TaskResponse.AssignedTo,
        StartDate: TaskResponse.StartDate,
        DueDate: TaskResponse.DueDate,
      });
    } else {
      console.warn('No lead data found.');
    }
  }
}
