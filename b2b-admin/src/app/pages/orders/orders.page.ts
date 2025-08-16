import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order, OrderItem } from '../../shared/models/order.model';
import { Product } from '../../shared/models/product.model';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orders',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './orders.page.html',
})
export class OrdersPage implements OnInit {
  private fb = inject(FormBuilder);
  private ordersApi = inject(OrderService);
  private productsApi = inject(ProductService);

  orders: Order[] = [];
  products: Product[] = [];

  displayedColumns = ['id', 'items', 'createdAt', 'actions'];

  form = this.fb.group({
    items: this.fb.array<FormArray>([]),
  });

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
    this.addItem(); // start with one row
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(
      this.fb.group({
        productId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeItem(i: number) {
    if (this.items.length === 1) return; // keep at least one row
    this.items.removeAt(i);
  }

  loadProducts() {
    this.productsApi.getAll().subscribe((res) => (this.products = res));
  }

  loadOrders() {
    this.ordersApi.getAll().subscribe((res) => (this.orders = res));
  }

  submit() {
    if (this.form.invalid) return;
    const payload: Order = { items: this.form.value.items as OrderItem[] };
    this.ordersApi.create(payload).subscribe(() => {
      this.form.reset({ items: [] });
      this.items.clear();
      this.addItem();
      this.loadOrders();
    });
  }

  delete(o: Order) {
    if (!o.id) return;
    if (!confirm(`Delete order #${o.id}?`)) return;
    this.ordersApi.remove(o.id).subscribe(() => this.loadOrders());
  }

  // helpers to render names if backend doesn't populate 'product'
  productName(id?: number) {
    const p = this.products.find((x) => x.id === id);
    return p ? p.name : `#${id}`;
  }

  trackByIndex = (_: number, i: any) => i;
}
