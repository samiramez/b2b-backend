import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginPage } from './pages/login/login.page';
import { ProductsPage } from './pages/products/products.page';
import { OrdersPage } from './pages/orders/orders.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: 'products',
    component: ProductsPage,
    canMatch: [authGuard],
    data: { roles: ['admin', 'supplier', 'customer'] },
  },
  {
    path: 'orders',
    component: OrdersPage,
    canMatch: [authGuard, roleGuard],
    data: { roles: ['admin', 'customer'] }, // suppliers can’t place orders by default
  },
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: '**', redirectTo: 'products' },
];
