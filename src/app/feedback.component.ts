import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from './supabase.service';

interface Feedback {
  id: string | number;
  name: string;
  serverRoles: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  verifiedPlatform: 'Mercado Livre' | 'Discord';
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.Default, // Alterado para Default para refletir a busca assíncrona
  template: `
    <section class="py-24 px-6 relative z-10 max-w-7xl mx-auto overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8b26ff]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="mb-16 flex flex-col items-center text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ab60ff]/10 border border-[#ab60ff]/20 mb-4">
           <mat-icon class="text-[#ab60ff] text-sm h-4 w-4">star</mat-icon>
           <span class="text-xs font-semibold tracking-wider text-[#ab60ff] uppercase">Feedbacks Verificados</span>
        </div>
        <h3 class="font-display text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">
          O que a <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#ab60ff] to-[#8b26ff]">comunidade</span> diz
        </h3>
        <p class="mt-4 max-w-2xl text-gray-400 text-sm md:text-base font-sans">
          Veja a experiência de donos de servidores que já otimizaram suas cidades com a Vertex Studios.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        @for (feedback of feedbacks; track feedback.id) {
          <div class="flex flex-col bg-[#160b26]/60 backdrop-blur-md border border-white/[0.05] rounded-3xl p-8 hover:border-[#8b26ff]/30 hover:-translate-y-2 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            
            <div class="flex items-center justify-between mb-6">
              <div class="flex gap-1 text-[#FFE600]">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <mat-icon class="h-5 w-5 scale-90">
                    {{ star <= feedback.rating ? 'star' : 'star_border' }}
                  </mat-icon>
                }
              </div>
              
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-mono">
                @if (feedback.verifiedPlatform === 'Mercado Livre') {
                   <div class="w-2 h-2 rounded-full bg-[#FFE600]"></div>
                } @else {
                   <div class="w-2 h-2 rounded-full bg-[#5865F2]"></div>
                }
                COMPRA SEGURA
              </div>
            </div>

            <p class="text-gray-300 text-sm leading-relaxed mb-8 flex-grow font-sans">
              "{{ feedback.comment }}"
            </p>

            <div class="flex items-center gap-4 mt-auto">
              <img [src]="feedback.avatarUrl" [alt]="feedback.name" class="w-12 h-12 rounded-full border border-[#8b26ff]/40 bg-gray-800" referrerpolicy="no-referrer">
              <div class="flex flex-col">
                <span class="text-white font-medium text-sm font-sans">{{ feedback.name }}</span>
                <span class="text-[#ab60ff] text-xs font-mono">{{ feedback.serverRoles }}</span>
              </div>
            </div>

          </div>
        }
      </div>
    </section>
  `
})
export class FeedbackComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  feedbacks: Feedback[] = [
    {
      id: 1,
      name: 'João M.',
      serverRoles: 'Fundador · Cidade Alta',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
      comment: 'Script incrível, super otimizado. O MS do meu servidor cravou em 0.01 sem drops após trocar pelo Vertex Core. Recomendo demais!',
      rating: 5,
      verifiedPlatform: 'Mercado Livre'
    },
    {
      id: 2,
      name: 'Carlos S.',
      serverRoles: 'Dev · Servidor Complexo',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      comment: 'O sistema de polícia é o mais completo que já vi. Tem painel MDT, radares integrados e tablet 100% responsivo.',
      rating: 5,
      verifiedPlatform: 'Mercado Livre'
    },
    {
      id: 3,
      name: 'Lucas R.',
      serverRoles: 'Owner · Hype Town',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
      comment: 'Suporte muito rápido no Discord, me ajudaram a configurar a database antiga que eu tinha sem perder nada. Muito satisfeito.',
      rating: 5,
      verifiedPlatform: 'Discord'
    }
  ];

  async ngOnInit() {
    const { data, error } = await this.supabaseService.getFeedbacks();
    if (!error && data && data.length > 0) {
      this.feedbacks = data.map(item => ({
        id: item.id,
        name: item.name,
        serverRoles: item.server_roles,
        avatarUrl: item.avatar_url,
        comment: item.comment,
        rating: item.rating,
        verifiedPlatform: item.verified_platform
      }));
    }
  }
}

