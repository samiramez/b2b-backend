import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interface/product.model';
import { endPoints } from 'src/api/apiConfig';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Product[]>(endPoints.products.getAll);
  }

  getById(id: number) {
    return this.http.get<Product>(endPoints.products.getById(id));
  }

  create(data: Product) {
    return this.http.post<Product>(endPoints.products.create, data);
  }

  update(id: number, data: Partial<Product>) {
    return this.http.put<Product>(endPoints.products.update(id), data);
  }

  remove(id: number) {
    return this.http.delete<void>(endPoints.products.delete(id));
  }
}
