import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { CadastroRequest } from '../models/cadastro-request.model';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((response) => this.salvarToken(response.token)),
      switchMap((response) => {
        if (response.usuario) {
          this.salvarUsuario(response.usuario);
          return of(response);
        }

        return this.carregarUsuario().pipe(
          tap((usuario) => this.salvarUsuario(usuario)),
          switchMap((usuario) => of({ ...response, usuario }))
        );
      })
    );
  }

  cadastro(data: CadastroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/cadastro`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): Usuario | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    const perfil = user?.perfil;
    const nomePerfil = typeof perfil === 'string' ? perfil : perfil?.nome;
    return nomePerfil === 'ADMIN' || nomePerfil === 'ROLE_ADMIN';
  }

  carregarUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/auth/me`);
  }

  salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  salvarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.userKey, JSON.stringify(usuario));
  }
}
