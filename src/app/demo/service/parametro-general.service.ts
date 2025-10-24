/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { ParametroGeneral } from '../model/ParametroGeneral';

@Injectable({
  providedIn: 'root'
})
export class ParametroGeneralService {

  private http = inject(HttpClient);
      //apiUrl: string = ''; //
      urlAPI: string = ''; //
      apiUrl: any;

      //Lista con datos mock, eliminar luego
      public parametroGeneralList: ParametroGeneral[] = [
        {
            pla40anio: '2025',
            pla40codigo: '01',
            pla40descripcion: 'REMUNERACION MINIMA VITAL',
            pla40flagtipodato: 'I',
            pla4001: 1130.00,
            pla4002: 1130.00,
            pla4003: 1130.00,
            pla4004: 1130.00,
            pla4005: 1130.00,
            pla4006: 1130.00,
            pla4007: 1130.00,
            pla4008: 1130.00,
            pla4009: 1130.00,
            pla4010: 1130.00,
            pla4011: 1130.00,
            pla4012: 1130.00
        },
        {
            pla40anio: '2025',
            pla40codigo: '03',
            pla40descripcion: 'APORTE SENATI',
            pla40flagtipodato: 'P',
            pla4001: 0.75,
            pla4002: 0.75,
            pla4003: 0.75,
            pla4004: 0.75,
            pla4005: 0.75,
            pla4006: 0.75,
            pla4007: 0.75,
            pla4008: 0.75,
            pla4009: 0.75,
            pla4010: 0.75,
            pla4011: 0.75,
            pla4012: 0.75
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

      public GetParametrosGenerales(): Observable<ParametroGeneral[]>
      {
            return new Observable<ParametroGeneral[]>(observer => {
              observer.next(this.parametroGeneralList);
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

      public CrearParametroGeneral(parametro: ParametroGeneral): Observable<any> {
            const existe = this.parametroGeneralList.some(p =>
              p.pla40anio === parametro.pla40anio &&
                p.pla40codigo === parametro.pla40codigo
            );

            return new Observable(observer => {
                if (existe) {
                    observer.error({ success: false, message: 'Ya existe un registro con ese código' });
                } else {
                    this.parametroGeneralList.push({ ...parametro });
                    observer.next({ success: true, message: 'Registro guardado correctamente' });
                    observer.complete();
                }
            });
            //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
        }

      public ActualizarParametroGeneral(parametro: ParametroGeneral): Observable<any> {

                    const index = this.parametroGeneralList.findIndex(r =>
                        r.pla40anio === parametro.pla40anio &&
                        r.pla40codigo === parametro.pla40codigo
                    );

                    if (index !== -1) {
                        this.parametroGeneralList[index] = { ...parametro };

                        return new Observable(observer => {
                          //console.log('Registro actualizado:', this.parametroGeneralList[index]);
                            observer.next({ success: true, message: 'Registro actualizado correctamente' });
                            observer.complete();
                        });
                    } else {
                        return new Observable(observer => {
                          //console.log('No se encontró el registro para actualizar');
                            observer.error({ success: false, message: 'No se pudo encontrar el registro para actualizar' });
                        });
                    }
            /*let urlmodificada = this.urlAPI + '/SpUpdate';
            return this.http.put<any>(urlmodificada, regimen);*/
        }

      public EliminarParametroGeneral(anio: string, idparametro: string): Observable<any> {
        const index = this.parametroGeneralList.findIndex(p =>
            p.pla40anio === anio &&
            p.pla40codigo === idparametro
        );

        return new Observable(observer => {
            if (index !== -1) {
                this.parametroGeneralList.splice(index, 1);
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
        public getData(): Observable<ParametroGeneral[]> {
            return this.http.get<ParametroGeneral[]>(this.urlAPI);
        }
}
