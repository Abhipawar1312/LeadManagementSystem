import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tasks } from '../models/Tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  url: string = "https://localhost:44353/api/tasks";
  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<Tasks[]>(`${this.url}`)
  }

  postTasks(data: Tasks) {
    return this.http.post<Tasks>(`${this.url}`, data)
  }

  updateTasks(data: Tasks, TaskID: number) {
    return this.http.patch<Tasks>(`${this.url}/${TaskID}`, data);
  }

  deleteTasks(TaskID: number) {
    return this.http.delete<Tasks>(`${this.url}/${TaskID}`)
  }

  getTasksId(TaskID: number) {
    return this.http.get<Tasks>(`${this.url}/${TaskID}`);
  }
}
