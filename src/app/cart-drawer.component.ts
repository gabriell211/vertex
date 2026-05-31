import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from './cart.service';
import { SupabaseService } from './supabase.service';


@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        (click)="cart.closeCart()"
      ></div>

      <!-- Drawer -->
      <div class="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0d0617] border-l border-white/10 shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ease-in-out">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10">
          <div class="flex items-center gap-3">
             <mat-icon class="text-[#8b26ff]">shopping_cart</mat-icon>
             <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">Carrinho</h2>
          </div>
          <button 
            class="text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 p-2"
            (click)="cart.closeCart()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          @if (cart.items().length === 0) {
            <div class="flex flex-col items-center justify-center h-full text-center opacity-50">
               <mat-icon class="text-6xl mb-4 text-gray-500">remove_shopping_cart</mat-icon>
               <p class="font-sans text-gray-300">Seu carrinho está vazio.</p>
            </div>
          } @else {
            @for (item of cart.items(); track item.id) {
              <div class="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                 <img [src]="item.thumbnail" [alt]="item.title" class="w-16 h-16 object-cover rounded-lg bg-black" referrerpolicy="no-referrer">
                 <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-white line-clamp-1">{{ item.title }}</h4>
                      <div class="text-[#ab60ff] font-mono text-sm font-bold mt-1">R$ {{ item.price.toFixed(2) }}</div>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                       <div class="flex items-center gap-2 bg-black/50 rounded-md border border-white/10 p-1">
                          <button class="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors" (click)="cart.updateQuantity(item.id, item.quantity - 1)">
                             <mat-icon class="scale-75">remove</mat-icon>
                          </button>
                          <span class="text-xs font-mono text-white w-4 text-center">{{ item.quantity }}</span>
                          <button class="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors" (click)="cart.updateQuantity(item.id, item.quantity + 1)">
                             <mat-icon class="scale-75">add</mat-icon>
                          </button>
                       </div>
                       <button class="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors" (click)="cart.removeItem(item.id)">
                          <mat-icon class="scale-75">delete_outline</mat-icon>
                       </button>
                    </div>
                 </div>
              </div>
            }
          }
        </div>

        <!-- Footer -->
        @if (cart.items().length > 0) {
          <div class="p-6 border-t border-white/10 bg-black/20">
            <div class="flex justify-between items-center mb-6">
              <span class="text-gray-400 font-sans text-sm uppercase tracking-wider">Total</span>
              <span class="text-2xl font-mono font-bold text-white tracking-tighter">
                R$ <span class="text-[#ab60ff]">{{ cart.totalPrice().toFixed(2) }}</span>
              </span>
            </div>
            <button 
              (click)="onCheckout()"
              class="w-full py-4 rounded-lg bg-gradient-to-r from-[#5814a8] to-[#8b26ff] hover:from-[#8b26ff] hover:to-[#ab60ff] transition-all text-white uppercase font-display text-sm tracking-widest font-bold shadow-[0_0_20px_rgba(139,38,255,0.3)]"
            >
              Finalizar Compra
            </button>
          </div>
        }
      </div>
    }
  `
})
export class CartDrawerComponent {
  cart = inject(CartService);
  private supabaseService = inject(SupabaseService);

  async onCheckout() {
    const user = this.supabaseService.getCurrentUser();
    if (!user) {
      alert('Por favor, cadastre-se ou faça login para finalizar a compra!');
      return;
    }

    const { error } = await this.cart.checkout(this.supabaseService);
    if (error) {
      alert('Erro ao finalizar compra: ' + error.message);
    } else {
      alert('Compra finalizada com sucesso! Seus dados foram salvos no Supabase.');
    }
  }
}

