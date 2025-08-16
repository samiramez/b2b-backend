import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  pageTitle = 'Admin Dashboard';

  // Define your pages and allowed roles
  pages = [
    { path: '/products', label: 'Products', roles: ['admin'] },
    { path: '/orders', label: 'Orders', roles: ['admin', 'customer'] },
  ];

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get role(): string {
    return this.auth.getUserRole() ?? 'guest'; // Ensure role is always a string
  }

  constructor() {
    // Update page title when navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const page = this.pages.find(p => event.urlAfterRedirects.startsWith(p.path));
        this.pageTitle = page ? page.label : 'Admin Dashboard';
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
