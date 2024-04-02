import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../models/Users.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url: string = "https://localhost:44353/api/users";
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<Users[]>(`${this.url}`)
  }

  postUsers(FormData: FormData) {
    return this.http.post(`${this.url}`, FormData)
  }

  updateUsers(FormData: FormData, UserID: number) {
    return this.http.patch(`${this.url}/${UserID}`, FormData);
  }

  deleteUsers(UserID: number) {
    return this.http.delete<Users>(`${this.url}/${UserID}`)
  }

  getUsersId(UserID: number) {
    return this.http.get<Users>(`${this.url}/${UserID}`);
  }
}
