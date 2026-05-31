import { Component, ChangeDetectionStrategy, signal, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate } from 'motion';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div #splash class="fixed inset-0 z-50 bg-[#090212] flex flex-col items-center justify-center">
         <div class="w-48 h-48 drop-shadow-[0_0_30px_rgba(139,38,255,0.4)]">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="purplePart" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#bf80ff" />
                  <stop offset="60%" stop-color="#8b26ff" />
                  <stop offset="100%" stop-color="#3d0080" />
                </linearGradient>
                <linearGradient id="silverPart" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#e0e0e0" />
                  <stop offset="100%" stop-color="#4a4a4a" />
                </linearGradient>
              </defs>
              <path d="M 50 30 L 100 170 L 115 130 L 75 35 Z" fill="url(#purplePart)" />
              <path d="M 105 60 L 160 35 L 105 160 L 115 125 Z" fill="url(#silverPart)" />
            </svg>
         </div>
         <h1 class="mt-8 font-display text-4xl tracking-[0.4em] font-bold text-white uppercase ml-4">Vertex</h1>
         <div class="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div class="absolute top-0 left-0 h-full bg-[#8b26ff] rounded-full" style="width: 100%; animation: load 2s ease-in-out forwards;"></div>
         </div>
      </div>
    }
  `,
  styles: [`
    @keyframes load {
      0% { width: 0%; transform: translateX(-100%); }
      100% { width: 100%; transform: translateX(0); }
    }
  `]
})
export class SplashComponent implements AfterViewInit {
  isVisible = signal(true);
  @ViewChild('splash') splashRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.splashRef) {
        animate(
          this.splashRef.nativeElement,
          { opacity: 0, scale: 1.05 },
          { duration: 0.6, ease: 'easeOut' }
        ).finished.then(() => {
          this.isVisible.set(false);
        });
      }
    }, 2200);
  }
}
