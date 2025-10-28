/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { RegimenPensionario } from '../model/RegimenPensionario';

@Injectable({
  providedIn: 'root'
})
export class RegimenPensionarioService {
  private http = inject(HttpClient);
  //apiUrl: string = ''; //
  urlAPI: string = ''; //
  apiUrl: any;

  //Lista con datos mock, eliminar luego
  public regimenPensionarioList: RegimenPensionario[] = [
    {
            pla61codigo: '01',
            pla61descripcion: 'SIST NACIONAL DE PENSIONES DL 19990',
            pla61tiporegpensionariocod: 'SNP',
            pla61flagsectorprivado: 'S',
            pla61flagsectorpublico: 'S',
            pla61afpnetcod: '',
            pla61plamecod: '02',
            pla61flagactivo: 'S'
        },
        {
            pla61codigo: '02',
            pla61descripcion: 'INTEGRA',
            pla61tiporegpensionariocod: 'SPP',
            pla61flagsectorprivado: 'S',
            pla61flagsectorpublico: 'S',
            pla61afpnetcod: 'IN',
            pla61plamecod: '21',
            pla61flagactivo: 'S'
        }
  ];

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    //this.apiUrl = configService.getApiUrl();
    //this.urlAPI = `${this.apiUrl}/Banco`;
  }

  private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

  public GetRegimenesPensionarios(): Observable<RegimenPensionario[]>
  {
        return new Observable<RegimenPensionario[]>(observer => {
          observer.next(this.regimenPensionarioList);
          observer.complete();
      });
        /*return this.http
            .get<RespuestaAPIBase<Banco[]>>(this.urlAPI + '/SpList?empresa=01')
            .pipe(
                map((response: RespuestaAPIBase<Banco[]>) => {
                    if (response.isSuccess && response.data) {
                        // console.log(response.data);
                        return response.data;
                    } else {
                        console.error(
                            'Error en la API:',
                            response.message,
                            response.messageException
                        );
                        return [];
                    }
                }),
                catchError(this.handleError)
            );*/
    }

  public CrearRegimenPensionario(regimen: RegimenPensionario): Observable<any> {
        const existe = this.regimenPensionarioList.some(r =>
            r.pla61codigo === regimen.pla61codigo
        );

        return new Observable(observer => {
            if (existe) {
                observer.error({ success: false, message: 'Ya existe un registro con ese código' });
            } else {
                this.regimenPensionarioList.push({ ...regimen });
                observer.next({ success: true, message: 'Registro guardado correctamente' });
                observer.complete();
            }
        });
        //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
    }

    // Generar nuevo codigo
    public GenerarNuevoCodigoRegimen(): string {
      const codigos = this.regimenPensionarioList.map(p => parseInt(p.pla61codigo, 10));
      const max = codigos.length > 0 ? Math.max(...codigos) : 0;
      const nuevoCodigo = (max + 1).toString().padStart(2, '0');
      return nuevoCodigo;
    }

  public ActualizarRegimenPensionario(regimen: RegimenPensionario): Observable<any> {

                const index = this.regimenPensionarioList.findIndex(r =>
                    r.pla61codigo === regimen.pla61codigo
                );

                if (index !== -1) {
                    this.regimenPensionarioList[index] = { ...regimen };

                    return new Observable(observer => {
                      //console.log('Registro actualizado:', this.regimenPensionarioList[index]);
                        observer.next({ success: true, message: 'Registro actualizado correctamente' });
                        observer.complete();
                    });
                } else {
                    return new Observable(observer => {
                      //console.log('No se encontró el registro para actualizar:', regimen.pla61codigo);
                        observer.error({ success: false, message: 'No se pudo encontrar el registro para actualizar' });
                    });
                }
        /*let urlmodificada = this.urlAPI + '/SpUpdate';
        return this.http.put<any>(urlmodificada, regimen);*/
    }

  public EliminarRegimenPensionario(idregimen: string): Observable<any> {
    const index = this.regimenPensionarioList.findIndex(r =>
        r.pla61codigo === idregimen
      );

    return new Observable(observer => {
        if (index !== -1) {
            this.regimenPensionarioList.splice(index, 1);
            observer.next({ success: true, message: 'Registro eliminado correctamente' });
            observer.complete();
        } else {
            observer.error({ success: false, message: 'No se encontró el registro para eliminar' });
        }
    });
        //let urlmodificada = `${this.urlAPI}/SpDelete?idempresa=${idempresa}&idbanco=${plantilla}`;
        //return this.http.delete<any>(urlmodificada);
    }

    // Metodo no implementado ni usado aún
    public getData(): Observable<RegimenPensionario[]> {
        return this.http.get<RegimenPensionario[]>(this.urlAPI);
    }
}


