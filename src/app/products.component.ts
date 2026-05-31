import { Component, ChangeDetectionStrategy, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from './cart.service';
import { SearchService } from './search.service';

interface Product {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  permalink: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 px-6 relative z-10 max-w-7xl mx-auto">
      
      <div class="mb-12 flex flex-col items-center text-center">
        <h3 class="font-display text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">
          Nossos <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#ab60ff] to-[#8b26ff]">Scripts</span>
        </h3>
        <p class="mt-4 max-w-2xl text-gray-400 text-sm md:text-base font-sans">
          Adquira com total segurança e entrega imediata.
        </p>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="w-12 h-12 rounded-full border-2 border-vertex-purple/20 border-t-vertex-purple animate-spin"></div>
        </div>
      } @else if (error()) {
        <div class="text-center py-20 text-red-400">
           Failed to load products. Make sure the server is running.
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @if (filteredProducts().length === 0) {
            <div class="col-span-full py-12 text-center text-gray-400 font-sans">
              Nenhum script encontrado para "{{ searchService.searchTerm() }}"
            </div>
          }
          @for (product of filteredProducts(); track product.id) {
            <div class="group relative flex flex-col bg-[#110822]/80 backdrop-blur-sm border border-[#2a1b42] rounded-2xl overflow-hidden hover:border-[#8b26ff]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,38,255,0.15)] flex-grow h-full">
              <!-- Glow effect on hover -->
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#8b26ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div class="relative w-full aspect-video overflow-hidden bg-[#090212]">
                 <div class="absolute inset-0 bg-vertex-purple/20 mix-blend-color z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <img [src]="product.thumbnail" [alt]="product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" crossorigin="anonymous" referrerpolicy="no-referrer">
                 <div class="absolute top-3 right-3 z-20 flex gap-2">
                    <span class="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-xs font-mono text-gray-300">v2.0</span>
                 </div>
              </div>
              
              <div class="flex flex-col flex-1 p-6 h-full">
                <h4 class="font-display font-medium text-lg text-white mb-2 leading-tight group-hover:text-[#ab60ff] transition-colors flex-1">{{ product.title }}</h4>
                
                <div class="flex items-end justify-between mt-auto pt-6">
                  <div>
                    <span class="text-xs text-gray-400 font-sans tracking-wide block mb-1">Pagamento Seguro</span>
                    <span class="font-mono text-2xl font-bold text-white tracking-tighter">
                      <span class="text-xs align-top mr-1 line-through text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">R$ {{ (product.price * 1.5).toFixed(2) }}</span>
                      <br>
                      R$ <span class="text-[#ab60ff]">{{ product.price.toFixed(2) }}</span>
                    </span>
                  </div>
                  
                  <button (click)="cart.addItem(product)" class="w-12 h-12 rounded-full border border-[#8b26ff]/30 bg-[#8b26ff]/10 flex items-center justify-center text-[#8b26ff] group-hover:bg-[#8b26ff] group-hover:text-white transition-all duration-300">
                    <mat-icon>add_shopping_cart</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal(false);
  cart = inject(CartService);
  searchService = inject(SearchService);

  filteredProducts = computed(() => {
    const term = this.searchService.searchTerm().trim().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(p => p.title.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const response = await fetch('/api/mercadolivre/products');
      if (!response.ok) throw new Error('API Error');
      const json = await response.json();
      this.products.set(json.data);
    } catch (e) {
      this.error.set(true);
      console.error('Error fetching ML products:', e);
    } finally {
      this.loading.set(false);
    }
  }
}
