import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  isOpen = signal(false);
  items = signal<CartItem[]>([]);

  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  addItem(product: any) {
    this.items.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { 
        id: product.id, 
        title: product.title, 
        price: product.price, 
        thumbnail: product.thumbnail, 
        quantity: 1 
      }];
    });
    this.openCart();
  }

  removeItem(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    this.items.update(items => items.map(i => i.id === id ? { ...i, quantity } : i));
  }

  // Checkout no Supabase
  async checkout(supabaseService: any) {
    if (this.items().length === 0) return { error: new Error('Carrinho vazio') };

    const itemsToSave = this.items().map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    }));

    const { error } = await supabaseService.saveOrder(itemsToSave, this.totalPrice());
    if (!error) {
      this.items.set([]); // Limpa o carrinho
      this.closeCart();
    }
    return { error };
  }
}

