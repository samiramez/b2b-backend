import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Order } from '../interface/order.model';
import { endPoints } from 'src/api/apiConfig';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  /** Get all orders */
  getAll(): Observable<Order[]> {
    return this.http
      .get<Order[]>(endPoints.orders.getAll)
      .pipe(catchError(this.handleError));
  }

  /** Get order by id */
  getById(id: number): Observable<Order> {
    return this.http
      .get<Order>(endPoints.orders.getById(id))
      .pipe(catchError(this.handleError));
  }

  /** Create a new order */
  create(data: Order): Observable<Order> {
    return this.http
      .post<Order>(endPoints.orders.create, data)
      .pipe(catchError(this.handleError));
  }

  /** Update an order */
  update(id: number, data: Order): Observable<Order> {
    return this.http
      .put<Order>(endPoints.orders.getById(id), data)
      .pipe(catchError(this.handleError));
  }

  /** Delete an order */
  remove(id: number): Observable<void> {
    return this.http
      .delete<void>(endPoints.orders.getById(id))
      .pipe(catchError(this.handleError));
  }

  /** Centralized error handling */
  private handleError(error: any) {
    console.error('OrderService Error:', error);
    return throwError(() => error);
  }
}
