import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Order } from '../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.api}/orders`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Order[]>(this.base);
  }
  getOne(id: number) {
    return this.http.get<Order>(`${this.base}/${id}`);
  }
  create(data: Order) {
    return this.http.post<Order>(this.base, data);
  }
  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
