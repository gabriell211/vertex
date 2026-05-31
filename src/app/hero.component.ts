import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div class="w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-[#8b26ff]/10 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>
      
      <!-- Main Content -->
      <div class="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 w-full text-center">
        
        <!-- Big V Logo -->
        <div #logo class="w-64 h-64 md:w-80 md:h-80 opacity-0 transform translate-y-8 drop-shadow-[0_10px_40px_rgba(139,38,255,0.3)] mb-8">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <defs>
              <linearGradient id="purplePartHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#cf94ff" />
                <stop offset="50%" stop-color="#8b26ff" />
                <stop offset="100%" stop-color="#3d0080" />
              </linearGradient>
              <linearGradient id="silverPartHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#333333" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M 45 25 L 100 175 L 115 130 L 75 30 Z" fill="url(#purplePartHero)" filter="url(#glow)"/>
            <path d="M 100 65 L 165 30 L 105 165 L 115 130 Z" fill="url(#silverPartHero)" />
          </svg>
        </div>

        <!-- Title -->
        <div #titleGroup class="flex flex-col items-center opacity-0 transform translate-y-8">
          <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] uppercase bg-gradient-to-tr from-gray-400 via-white to-gray-200 bg-clip-text text-transparent ml-4">
            Vertex
          </h1>
          <div class="flex items-center gap-6 mt-4 md:mt-6 w-full">
            <div class="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#8b26ff]/60"></div>
            <h2 class="font-display text-xl md:text-3xl font-medium tracking-[0.4em] uppercase text-[#bd85ff] ml-3">
              Studios
            </h2>
            <div class="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#8b26ff]/60"></div>
          </div>
        </div>

        <!-- Subtitle w/ Discord -->
        <div #subtitle class="mt-12 flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 opacity-0 transform translate-y-8">
          <a href="https://discord.gg/E576rRV7Wy" target="_blank" rel="noopener noreferrer" class="group relative flex items-center gap-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm shadow-[0_0_20px_rgba(88,101,242,0.15)] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
            <mat-icon class="text-[#5865F2] group-hover:scale-110 transition-transform">discord</mat-icon>
            <span class="font-sans font-medium text-sm md:text-base tracking-[0.2em] text-white uppercase group-hover:text-blue-100 transition-colors">
              Discord
            </span>
          </a>


          <span class="font-display text-base md:text-xl tracking-[0.2em] uppercase text-gray-400">
            Sua loja de scripts <span class="text-[#8b26ff] font-bold">FiveM</span>
          </span>
        </div>

        <!-- Features -->
        <div #features class="mt-16 w-full max-w-4xl opacity-0 transform translate-y-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)]">
            <div class="flex items-center gap-4 animate-item opacity-0">
              <mat-icon class="text-[#8b26ff] text-3xl h-8 w-8 scale-125">code</mat-icon>
              <div class="text-left">
                <span class="block text-xs font-semibold tracking-wider text-gray-300 uppercase leading-tight">Scripts</span>
                <span class="block text-xs font-semibold tracking-wider text-white uppercase leading-tight">Exclusivos</span>
              </div>
            </div>
            <div class="flex items-center gap-4 animate-item opacity-0">
              <mat-icon class="text-[#8b26ff] text-3xl h-8 w-8 scale-125">verified_user</mat-icon>
              <div class="text-left">
                <span class="block text-xs font-semibold tracking-wider text-gray-300 uppercase leading-tight">Seguros</span>
                <span class="block text-xs font-semibold tracking-wider text-white uppercase leading-tight">e Otimizados</span>
              </div>
            </div>
            <div class="flex items-center gap-4 animate-item opacity-0">
              <mat-icon class="text-[#8b26ff] text-3xl h-8 w-8 scale-125">bolt</mat-icon>
              <div class="text-left">
                <span class="block text-xs font-semibold tracking-wider text-white uppercase leading-tight">Alto</span>
                <span class="block text-xs font-semibold tracking-wider text-gray-300 uppercase leading-tight">Desempenho</span>
              </div>
            </div>
            <div class="flex items-center gap-4 animate-item opacity-0">
              <mat-icon class="text-[#8b26ff] text-3xl h-8 w-8 scale-125">headset_mic</mat-icon>
              <div class="text-left">
                <span class="block text-xs font-semibold tracking-wider text-gray-300 uppercase leading-tight">Suporte</span>
                <span class="block text-xs font-semibold tracking-wider text-white uppercase leading-tight">Dedicado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Tagline -->
        <div #tagline class="mt-16 flex items-center justify-center gap-6 opacity-0 transform translate-y-8">
          <span class="text-[#8b26ff] text-2xl">［</span>
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 flex items-center justify-center opacity-80">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path d="M 45 25 L 100 175 L 115 130 L 75 30 Z" fill="#8b26ff"/>
                <path d="M 100 65 L 165 30 L 105 165 L 115 130 Z" fill="#a0a0a0" />
              </svg>
            </div>
            <span class="font-display text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] font-medium uppercase text-gray-300">
              Qualidade. Performance. <span class="text-[#8b26ff]">Confiança.</span>
            </span>
          </div>
          <span class="text-[#8b26ff] text-2xl">］</span>
        </div>

      </div>
    </section>
  `
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('logo') logo!: ElementRef;
  @ViewChild('titleGroup') titleGroup!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('features') features!: ElementRef;
  @ViewChild('tagline') tagline!: ElementRef;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Delay animation to allow splash screen to run
    setTimeout(() => {
      const elements = [
        this.logo.nativeElement,
        this.titleGroup.nativeElement,
        this.subtitle.nativeElement,
        this.features.nativeElement,
        this.tagline.nativeElement
      ];

      animate(
        elements,
        { opacity: [0, 1], y: [30, 0] },
        { 
          delay: stagger(0.15), 
          duration: 0.8, 
          ease: 'easeOut'
        }
      ).finished.then(() => {
        // Animate individual feature items
        const featureItems = this.el.nativeElement.querySelectorAll('.animate-item');
        if (featureItems.length > 0) {
           animate(
             featureItems,
             { opacity: [0, 1], scale: [0.9, 1] },
             { delay: stagger(0.1), duration: 0.5, ease: 'easeOut' }
           );
        }
      });
    }, 2000);
  }
}
