import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.api}/products`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Product[]>(this.base);
  }
  getOne(id: number) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
  create(data: Product) {
    return this.http.post<Product>(this.base, data);
  }
  update(id: number, data: Partial<Product>) {
    return this.http.put<Product>(`${this.base}/${id}`, data);
  }
  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
