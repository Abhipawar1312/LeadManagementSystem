import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { Registration } from '../models/Registration';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  Role!: string

  constructor(private hc: HttpClient) { }

  UserRegistration(data: any) {
    return this.hc.post("https://localhost:44353/api/Registration", data)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  // getRole() {
  //   return this.hc.get("https://localhost:44353/api/Registration", { responseType: 'text' })
  //     .pipe(
  //       map(response => JSON.parse(response)),
  //       catchError(error => throwError(error))
  //     );
  // }

}
