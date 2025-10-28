/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { ParametroxEmpresa } from '../model/ParametroxEmpresa';

@Injectable({
  providedIn: 'root'
})
export class ParametroEmpresaService {
    private http = inject(HttpClient);
    //apiUrl: string = ''; //
    urlAPI: string = ''; //
    apiUrl: any;
    //Lista con datos mock, eliminar luego
    public parametroxEmpresaList: ParametroxEmpresa[] = [
      {
            pla41empresacod: '001',
            pla41anio: '2025',
            pla41codigo: '01',
            pla41descripcion: 'CUOTA SINDICAL',
            pla41flagtipodato: 'N',
            pla4101: 10,
            pla4102: 10,
            pla4103: 10,
            pla4104: 10,
            pla4105: 10,
            pla4106: 10,
            pla4107: 10,
            pla4108: 10,
            pla4109: 10,
            pla4110: 10,
            pla4111: 10,
            pla4112: 10,
            pla41flagestandar: 'S'
        },
        {
            pla41empresacod: '002',
            pla41anio: '2025',
            pla41codigo: '02',
            pla41descripcion: 'SCTR',
            pla41flagtipodato: 'N',
            pla4101: 10,
            pla4102: 10,
            pla4103: 10,
            pla4104: 10,
            pla4105: 10,
            pla4106: 10,
            pla4107: 10,
            pla4108: 10,
            pla4109: 10,
            pla4110: 10,
            pla4111: 10,
            pla4112: 10,
            pla41flagestandar: 'S'
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

    public GetParametrosxEmpresa(): Observable<ParametroxEmpresa[]>
    {
          return new Observable<ParametroxEmpresa[]>(observer => {
            observer.next(this.parametroxEmpresaList);
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

    public CrearParametroxEmpresa(parametro: ParametroxEmpresa): Observable<any> {
          const existe = this.parametroxEmpresaList.some(p =>
              p.pla41empresacod === parametro.pla41empresacod &&
              p.pla41anio === parametro.pla41anio &&
              p.pla41codigo === parametro.pla41codigo
          );

          return new Observable(observer => {
              if (existe) {
                  observer.error({ success: false, message: 'Ya existe un registro con ese código' });
              } else {
                  this.parametroxEmpresaList.push({ ...parametro });
                  observer.next({ success: true, message: 'Registro guardado correctamente' });
                  observer.complete();
              }
          });
          //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
      }

    public ActualizarParametroxEmpresa(parametro: ParametroxEmpresa): Observable<any> {

                  const index = this.parametroxEmpresaList.findIndex(r =>
                      r.pla41codigo === parametro.pla41codigo &&
                      r.pla41empresacod === parametro.pla41empresacod &&
                      r.pla41anio === parametro.pla41anio
                  );

                  if (index !== -1) {
                      this.parametroxEmpresaList[index] = { ...parametro };

                      return new Observable(observer => {
                        //console.log('Registro actualizado:', this.parametroxEmpresaList[index]);
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

    public EliminarParametroxEmpresa(idempresa: string, anio: string, idparametro: string, ): Observable<any> {
      const index = this.parametroxEmpresaList.findIndex(p =>
          p.pla41codigo === idparametro &&
          p.pla41empresacod === idempresa &&
          p.pla41anio === anio
        );

      return new Observable(observer => {
          if (index !== -1) {
              this.parametroxEmpresaList.splice(index, 1);
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
      public getData(): Observable<ParametroxEmpresa[]> {
          return this.http.get<ParametroxEmpresa[]>(this.urlAPI);
      }
}
