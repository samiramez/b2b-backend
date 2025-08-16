import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../shared/models/product.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  createOutline,
  trashOutline,
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-products',
  standalone: true,
  styleUrls: ['./products.page.scss'],
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
    IonInput,
  ],
  templateUrl: './products.page.html',
})
export class ProductsPage implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private auth = inject(AuthService);

  displayedColumns = ['id', 'name', 'price', 'actions'];
  products: Product[] = [];
  loading = false;

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    addIcons({ personCircleOutline, createOutline, trashOutline, logOutOutline });
  }

  get role() {
    return this.auth.getUserRole();
  }

  get canManage() {
    return this.auth.hasRole(['admin', 'supplier']);
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  edit(p: Product) {
    this.form.patchValue(p);
  }

  cancelEdit() {
    this.form.reset({ id: null, name: '', price: 0 });
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  save() {
    if (this.form.invalid) return;

    this.loading = true;
    const { id, ...rest } = this.form.value as Product;

    const operation = id
      ? this.productService.update(id, rest)
      : this.productService.create(rest as Product);

    operation.subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  remove(p: Product) {
    if (!p.id) return;
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;

    this.loading = true;
    this.productService.remove(p.id).subscribe({
      next: () => this.load(),
      error: () => (this.loading = false),
    });
  }

  trackById = (_: number, item: Product) => item.id ?? 0;
}
