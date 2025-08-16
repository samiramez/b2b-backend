import { environment } from 'src/environments/environment';

const baseUrl = environment.api;

export const endPoints = {
  products: {
    getAll: `${baseUrl}/products`,
    getById: (id: number) => `${baseUrl}/products/${id}`,
    create: `${baseUrl}/products`,
    update: (id: number) => `${baseUrl}/products/${id}`,
    delete: (id: number) => `${baseUrl}/products/${id}`,
  },
  orders: {
    getAll: `${baseUrl}/orders`,
    getById: (id: number) => `${baseUrl}/orders/${id}`,
    create: `${baseUrl}/orders`,
    update: (id: number) => `${baseUrl}/orders/${id}`,
    delete: (id: number) => `${baseUrl}/orders/${id}`,
  },

  login: {
    login: `${baseUrl}/auth/login`,
  }
};
