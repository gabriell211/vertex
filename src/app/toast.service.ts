import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<Toast | null>(null);

  private timeoutId: any;

  show(message: string, type: 'success' | 'error' = 'success', durationMs = 4000) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.toast.set({ message, type });
    this.timeoutId = setTimeout(() => this.toast.set(null), durationMs);
  }
}
