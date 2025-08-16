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
import { Order, OrderItem } from '../../interface/order.model';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interface/product.model';
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

  // Pagination properties
  currentPage = 1;
  pageSize = 5; // number of orders per page

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

  /** FormArray getter */
  get items() {
    return this.form.get('items') as FormArray;
  }

  /** Add a new item row in the order form */
  addItem() {
    this.items.push(
      this.fb.group({
        productId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  /** Remove an item row */
  removeItem(i: number) {
    if (this.items.length === 1) return; // always keep at least one row
    this.items.removeAt(i);
  }

  /** Load products from API */
  loadProducts() {
    this.productsApi.getAll().subscribe((res) => (this.products = res));
  }

  /** Load orders from API */
  loadOrders() {
    this.ordersApi.getAll().subscribe((res) => (this.orders = res));
  }

  /** Submit new order */
  submit() {
    if (this.form.invalid) return;
    const payload: Order = { items: this.form.value.items as OrderItem[] };
    this.ordersApi.create(payload).subscribe(() => {
      this.items.clear();
      this.addItem(); // reset form
      this.loadOrders(); // reload orders to refresh table
      this.currentPage = 1; // reset to first page
    });
  }

  /** Delete an order */
  delete(o: Order) {
    if (!o.id) return;
    if (!confirm(`Delete order #${o.id}?`)) return;
    this.ordersApi.remove(o.id).subscribe(() => this.loadOrders());
  }

  /** Logout function */
  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  /** Calculate total price for an order */
  calculateOrderTotal(order: Order): number {
    if (!order.products) return 0;
    return order.products.reduce((total, prod) => {
      const qty = prod.OrderItem?.quantity || 0;
      const price = Number(prod.OrderItem?.unitPrice) || 0;
      return total + qty * price;
    }, 0);
  }

  /** TrackBy functions */
  trackById(index: number, item: Order) {
    return item.id;
  }

  trackByIndex = (_: number, i: any) => i;

  // ---------------- Pagination Methods ----------------

  /** Returns only the orders for the current page */
  paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(start, start + this.pageSize);
  }

  /** Calculate total pages */
  totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize) || 1;
  }

  /** Go to next page */
  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  /** Go to previous page */
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
