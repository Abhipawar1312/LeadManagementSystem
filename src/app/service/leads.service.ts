import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Leads } from '../models/leads.model';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {


  url: string = "https://localhost:44353/api/leads";
  constructor(private http: HttpClient) { }

  getLeads() {
    return this.http.get<Leads[]>(`${this.url}`)
  }

  postLeads(data: Leads) {
    return this.http.post<Leads>(`${this.url}`, data)
  }

  updateLeads(data: Leads, LeadID: number) {
    return this.http.patch<Leads>(`${this.url}/${LeadID}`, data);
  }

  deleteLeads(LeadID: number) {
    return this.http.delete<Leads>(`${this.url}/${LeadID}`)
  }

  getLeadsId(LeadID: number) {
    return this.http.get<Leads>(`${this.url}/${LeadID}`);
  }

  saveLeadsToDatabase(leads: any[]): Observable<any> {
    return this.http.post<any>(`${this.url}/import`, leads);
  }
}
