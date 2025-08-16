import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { endPoints } from 'src/api/apiConfig';

export type UserRole = 'admin' | 'supplier' | 'customer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  /** Login and return JWT token */
  login(body: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(endPoints.login.login, body)
      .pipe(catchError(this.handleError));
  }

  /** Save token */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /** Get token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Logout user */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // check expiration
    } catch {
      return false;
    }
  }

  /** Extract user role from token */
  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role as UserRole;
    } catch {
      return null;
    }
  }

  /** Check if user has required role(s) */
  hasRole(roles: UserRole[] | UserRole): boolean {
    const role = this.getUserRole();
    const allowed = Array.isArray(roles) ? roles : [roles];
    return !!role && allowed.includes(role);
  }

  /** Centralized error handling */
  private handleError(error: any) {
    console.error('AuthService Error:', error);
    return throwError(() => error);
  }
}
