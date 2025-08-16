import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

export type UserRole = 'admin' | 'supplier' | 'customer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private base = environment.api;
  

  constructor(private http: HttpClient) {}

  login(body: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, body);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): UserRole | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const dec: any = jwtDecode(t);
      return dec.role as UserRole;
    } catch {
      return null;
    }
  }

  hasRole(roles: UserRole[] | UserRole): boolean {
    const r = this.getUserRole();
    const arr = Array.isArray(roles) ? roles : [roles];
    return !!r && arr.includes(r);
  }
}
