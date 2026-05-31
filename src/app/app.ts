import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SplashComponent } from './splash.component';
import { HeroComponent } from './hero.component';
import { ProductsComponent } from './products.component';
import { FeedbackComponent } from './feedback.component';
import { CartDrawerComponent } from './cart-drawer.component';
import { CartService } from './cart.service';
import { SearchService } from './search.service';
import { RegisterModalComponent } from './register-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatIconModule, SplashComponent, HeroComponent, ProductsComponent, FeedbackComponent, CartDrawerComponent, RegisterModalComponent],
  template: `
    <app-splash></app-splash>

    <!-- Navigation Area -->
    <header class="fixed top-0 w-full z-40 bg-[#090212]/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-20">
        <div class="flex items-center gap-3 w-full md:w-auto justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 opacity-90">
               <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path d="M 45 25 L 100 175 L 115 130 L 75 30 Z" fill="#8b26ff"/>
                <path d="M 100 65 L 165 30 L 105 165 L 115 130 Z" fill="#a0a0a0" />
              </svg>
            </div>
            <span class="font-display font-bold tracking-[0.2em] uppercase text-white">Vertex</span>
          </div>

          <!-- Mobile Cart & Register (hidden on md) -->
          <div class="flex md:hidden items-center gap-2">
             <button class="relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-white/5" (click)="cart.openCart()">
                <mat-icon>shopping_cart</mat-icon>
                @if (cart.totalItems() > 0) {
                   <span class="absolute top-1 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#8b26ff] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full outline outline-2 outline-[#090212]">{{ cart.totalItems() }}</span>
                }
             </button>
             <button (click)="registerModal.open()" class="bg-gradient-to-r from-[#5814a8] to-[#8b26ff] text-white px-4 py-2 rounded hover:from-[#8b26ff] hover:to-[#ab60ff] transition-all duration-300 uppercase font-display text-[10px] tracking-widest font-bold flex items-center gap-1 shadow-[0_0_20px_rgba(139,38,255,0.2)] hover:shadow-[0_0_30px_rgba(139,38,255,0.5)]">
                <mat-icon class="text-[16px] w-4 h-4 scale-75">person_add</mat-icon> Registre-se
             </button>
          </div>
        </div>

        <!-- Desktop Search Bar -->
        <div class="flex-1 w-full max-w-md relative group">
           <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b26ff] transition-colors scale-90">search</mat-icon>
           <input type="text" placeholder="Buscar scripts... (ex: framework, police)" 
                  class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8b26ff]/50 focus:bg-white/10 transition-all font-sans"
                  [value]="searchService.searchTerm()"
                  (input)="searchService.updateSearch($any($event.target).value)">
        </div>
        
        <nav class="hidden lg:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-gray-400">
           <a href="#" class="text-white hover:text-[#8b26ff] transition-colors">Início</a>
           <a href="#" class="hover:text-white transition-colors">Scripts</a>
        </nav>

        <div class="hidden md:flex items-center gap-4">
           <button class="relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-white/5" (click)="cart.openCart()">
              <mat-icon>shopping_cart</mat-icon>
              @if (cart.totalItems() > 0) {
                 <span class="absolute top-1 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#8b26ff] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full outline outline-2 outline-[#090212]">{{ cart.totalItems() }}</span>
              }
           </button>
           <button (click)="registerModal.open()" class="bg-gradient-to-r from-[#5814a8] to-[#8b26ff] text-white px-6 py-2.5 rounded hover:from-[#8b26ff] hover:to-[#ab60ff] transition-all duration-300 uppercase font-display text-xs tracking-widest font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(139,38,255,0.2)] hover:shadow-[0_0_30px_rgba(139,38,255,0.5)]">
              <mat-icon class="text-sm scale-75">person_add</mat-icon> Registre-se
           </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen pt-32 md:pt-20">
      <app-hero></app-hero>
      <app-products></app-products>
      <app-feedback></app-feedback>
    </main>

    <!-- Minimal Footer -->
    <footer class="bg-[#05010a] border-t border-white/5 py-12">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3 opacity-50">
           <div class="w-6 h-6">
             <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <path d="M 45 25 L 100 175 L 115 130 L 75 30 Z" fill="#ffffff"/>
              <path d="M 100 65 L 165 30 L 105 165 L 115 130 Z" fill="#a0a0a0" />
            </svg>
          </div>
          <span class="font-display text-xs tracking-widest uppercase text-white">© 2024 Vertex Studios</span>
        </div>
        <div class="flex items-center text-xs tracking-widest uppercase font-mono text-gray-500 gap-6">
           <a href="#" class="hover:text-[#ab60ff] transition-colors">Termos</a>
           <a href="#" class="hover:text-[#ab60ff] transition-colors">Privacidade</a>
        </div>
      </div>
    </footer>
    
    <app-cart-drawer></app-cart-drawer>
    <app-register-modal #registerModal></app-register-modal>
  `
})
export class App {
  cart = inject(CartService);
  searchService = inject(SearchService);
}

