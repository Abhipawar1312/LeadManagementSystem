import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '../models/Contacts.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  url: string = "https://localhost:44353/api/contacts";
  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get<Contacts[]>(`${this.url}`)
  }

  postContacts(data: Contacts) {
    return this.http.post<Contacts>(`${this.url}`, data)
  }

  updateContacts(data: Contacts, ContactID: number) {
    return this.http.patch<Contacts>(`${this.url}/${ContactID}`, data);
  }

  deleteContacts(ContactID: number) {
    return this.http.delete<Contacts>(`${this.url}/${ContactID}`)
  }

  getContactsId(ContactID: number) {
    return this.http.get<Contacts>(`${this.url}/${ContactID}`);
  }
}
