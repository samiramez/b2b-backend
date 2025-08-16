import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonRouterOutlet,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }
  get role() {
    return this.auth.getUserRole();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
