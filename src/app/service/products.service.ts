import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { products } from '../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  url: string = "https://localhost:44353/api/products";
  constructor(private http: HttpClient) { }

  getproducts() {
    return this.http.get<products[]>(`${this.url}`)
  }

  postproducts(FormData: FormData) {
    return this.http.post(`${this.url}`, FormData)
  }

  updateproducts(FormData: FormData, LeadID: number) {
    return this.http.patch(`${this.url}/${LeadID}`, FormData);
  }

  deleteproducts(productID: number) {
    return this.http.delete<products>(`${this.url}/${productID}`)
  }

  getproductsId(productID: number) {
    return this.http.get<products>(`${this.url}/${productID}`);
  }
}
