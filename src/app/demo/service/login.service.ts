// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login, EmpresasxModulo } from '../model/Login';
import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/api'; // Cambia esto por tu URL de API
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Verificar si ya está autenticado al iniciar
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(isAuth);
  }

  // Observable para saber si está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Método de autenticación (actualmente no se usa porque validamos con equals)
  autenticacion(autenticacion: Login): Observable<RespuestaAPIBase<Login[]>> {
    const url = `${this.apiUrl}/login/autenticar`;
    
    return this.http.post<RespuestaAPIBase<Login[]>>(url, autenticacion).pipe(
      map(response => {
        if (response.isSuccess) {
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('codigoEmpresa');
    localStorage.removeItem('codigoPerfil');
    this.isAuthenticatedSubject.next(false);
  }

  // Método para obtener empresas
  getEmpresa(codigomodulo: string): Observable<EmpresasxModulo[]> {
    const url = `${this.apiUrl}/empresa/modulo/${codigomodulo}`;
    
    return this.http.get<RespuestaAPIBase<EmpresasxModulo[]>>(url).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  // Método para validar token (opcional)
  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    const url = `${this.apiUrl}/login/validar-token`;
    return this.http.get<RespuestaAPIBase<boolean>>(url).pipe(
      map(response => {
        const isValid = response.isSuccess && response.data;
        this.isAuthenticatedSubject.next(isValid);
        return isValid;
      })
    );
  }
}