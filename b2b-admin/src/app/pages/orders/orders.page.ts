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
import { AuthService } from '../../services/auth.service';
import { Product } from '../../shared/models/product.model';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonButton,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from '@ionic/angular/standalone';
import {
  personCircleOutline,
  createOutline,
  trashOutline,
  logOutOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
  ],
  templateUrl: './orders.page.html',
})
export class OrdersPage implements OnInit {
  private fb = inject(FormBuilder);
  private ordersApi = inject(OrderService);
  private productsApi = inject(ProductService);
  private auth = inject(AuthService);

  orders: Order[] = [];
  products: Product[] = [];

  form = this.fb.group({
    items: this.fb.array<FormArray>([]),
  });

  constructor() {
    addIcons({
      personCircleOutline,
      createOutline,
      trashOutline,
      logOutOutline,
    });
  }

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
      this.items.clear();
      this.addItem(); // reset form to one row
      this.loadOrders(); // reload orders to display correct totals
    });
  }

  delete(o: Order) {
    if (!o.id) return;
    if (!confirm(`Delete order #${o.id}?`)) return;
    this.ordersApi.remove(o.id).subscribe(() => this.loadOrders());
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  productName(id?: number) {
    const p = this.products.find((x) => x.id === id);
    return p ? p.name : `#${id}`;
  }

  calculateOrderTotal(order: Order): number {
    if (!order.products) return 0;
    return order.products.reduce((total, prod) => {
      const qty = prod.OrderItem?.quantity || 0;
      const price = Number(prod.OrderItem?.unitPrice) || 0;
      return total + qty * price;
    }, 0);
  }

  trackById(index: number, item: Order) {
    return item.id;
  }

  trackByIndex = (_: number, i: any) => i;
}
