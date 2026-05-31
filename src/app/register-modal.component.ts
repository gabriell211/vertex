import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from './supabase.service';


@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-opacity"
        (click)="close()"
      >
        <!-- Modal -->
        <div 
          class="relative w-full max-w-md bg-[#0d0617] border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden transform transition-all"
          (click)="$event.stopPropagation()"
        >
          <!-- Glow effect -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#8b26ff]/20 rounded-full blur-[80px] pointer-events-none"></div>

          <button 
            class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1.5"
            (click)="close()"
          >
            <mat-icon class="scale-90">close</mat-icon>
          </button>

          <div class="flex flex-col items-center mb-8">
            <div class="w-12 h-12 mb-4">
               <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path d="M 45 25 L 100 175 L 115 130 L 75 30 Z" fill="#8b26ff"/>
                <path d="M 100 65 L 165 30 L 105 165 L 115 130 Z" fill="#a0a0a0" />
              </svg>
            </div>
            <h2 class="font-display font-bold text-2xl uppercase tracking-widest text-white">Criar Conta</h2>
            <p class="text-sm font-sans text-gray-400 mt-2 text-center">Junte-se à maior comunidade de scripts FiveM e baixe os seus recursos.</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 relative z-10">
            <div class="flex flex-col gap-1.5">
              <label for="name" class="font-sans text-xs font-semibold tracking-wider text-gray-400 uppercase">Nome de Usuário</label>
              <div class="relative group">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8b26ff] transition-colors scale-90">person</mat-icon>
                <input 
                  id="name" 
                  type="text" 
                  formControlName="name"
                  class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8b26ff]/50 focus:bg-white/10 transition-all font-sans"
                  placeholder="Seu nome"
                >
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="email" class="font-sans text-xs font-semibold tracking-wider text-gray-400 uppercase">E-mail</label>
              <div class="relative group">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8b26ff] transition-colors scale-90">email</mat-icon>
                <input 
                  id="email" 
                  type="email" 
                  formControlName="email"
                  class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8b26ff]/50 focus:bg-white/10 transition-all font-sans"
                  placeholder="seu@email.com"
                >
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="password" class="font-sans text-xs font-semibold tracking-wider text-gray-400 uppercase">Senha</label>
              <div class="relative group">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8b26ff] transition-colors scale-90">lock</mat-icon>
                <input 
                  id="password" 
                  type="password" 
                  formControlName="password"
                  class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8b26ff]/50 focus:bg-white/10 transition-all font-sans"
                  placeholder="••••••••"
                >
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading()"
              class="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-[#5814a8] to-[#8b26ff] hover:from-[#8b26ff] hover:to-[#ab60ff] transition-all text-white uppercase font-display text-sm tracking-widest font-bold shadow-[0_0_20px_rgba(139,38,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading() ? 'Registrando...' : 'Registrar' }}
            </button>
            
            <div class="mt-4 text-center">
              <span class="text-xs font-sans text-gray-500">Já tem uma conta? <a href="#" class="text-[#ab60ff] hover:underline">Faça login</a></span>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class RegisterModalComponent {
  isOpen = signal(false);
  isLoading = signal(false);
  registerForm: FormGroup;
  private supabaseService = inject(SupabaseService);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  open() {
    this.isOpen.set(true);
    this.registerForm.reset();
  }

  close() {
    this.isOpen.set(false);
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.registerForm.value;
      const { error } = await this.supabaseService.signUpWithPassword(email, password, name);
      this.isLoading.set(false);

      if (error) {
        alert('Erro ao registrar: ' + error.message);
      } else {
        alert('Cadastro realizado com sucesso! Verifique seu email caso necessário ou faça login.');
        this.close();
      }
    }
  }
}

