import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Como a app usa SSR (Server-Side Rendering), instanciamos o cliente apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      
      // Escutar mudanças de autenticação
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUserSubject.next(session?.user ?? null);
      });

      // Obter sessão inicial
      this.supabase.auth.getSession().then(({ data }) => {
        this.currentUserSubject.next(data.session?.user ?? null);
      });
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // --- AUTENTICAÇÃO ---
  async signUp(email: string, name: string) {
    if (!isPlatformBrowser(this.platformId)) return { error: new Error('SSR context') };
    
    // Cadastra o usuário no Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: 'password-generica-ou-definida', // No modal só há nome, email e senha, mas vamos usar a senha informada
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) return { error };

    // Se o usuário foi criado com sucesso, criamos o registro na tabela profiles
    if (data.user) {
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email
          }
        ]);
      
      if (profileError) console.error('Erro ao criar perfil:', profileError);
    }

    return { data };
  }

  // Sobrecarga/ajuste para suportar senha real fornecida no formulário
  async signUpWithPassword(email: string, password: string, name: string) {
    if (!isPlatformBrowser(this.platformId)) return { error: new Error('SSR context') };

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) return { error };

    if (data.user) {
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email
          }
        ]);
      
      if (profileError) console.error('Erro ao criar perfil:', profileError);
    }

    return { data };
  }

  async signIn(email: string, password: string) {
    if (!isPlatformBrowser(this.platformId)) return { error: new Error('SSR context') };
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.supabase.auth.signOut();
  }

  // --- FEEDBACKS ---
  async getFeedbacks() {
    if (!isPlatformBrowser(this.platformId)) return { data: [], error: null };
    return await this.supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
  }

  async submitFeedback(comment: string, rating: number, serverRoles: string = 'Cliente') {
    if (!isPlatformBrowser(this.platformId)) return { error: new Error('SSR context') };
    
    const user = this.getCurrentUser();
    if (!user) return { error: new Error('É necessário estar logado para enviar um feedback.') };

    return await this.supabase
      .from('feedbacks')
      .insert([
        {
          user_id: user.id,
          name: user.user_metadata?.['full_name'] || user.email,
          comment,
          rating,
          server_roles: serverRoles,
          verified_platform: 'Discord',
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`
        }
      ]);
  }

  // --- PEDIDOS (CARRINHO) ---
  async saveOrder(items: any[], total: number) {
    if (!isPlatformBrowser(this.platformId)) return { error: new Error('SSR context') };

    const user = this.getCurrentUser();
    const userId = user ? user.id : null; // Se não logado, pode ser nulo ou exigir login

    return await this.supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          items,
          total,
          status: 'completed' // Considera finalizado na simulação
        }
      ]);
  }
}
