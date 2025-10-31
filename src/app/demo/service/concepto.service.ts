/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { Concepto } from '../model/Concepto';
@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  private http = inject(HttpClient);
    //apiUrl: string = ''; //
    urlAPI: string = ''; //
    apiUrl: any;


    constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    //this.apiUrl = configService.getApiUrl();
    //this.urlAPI = `${this.apiUrl}/Banco`;
  }

    //Lista con datos mock, eliminar luego
    public conceptoList: Concepto[] = [
          {
              pla10empresacod: '00032',
              pla10conceptocod: '4220',
              pla10conceptodesc: 'SEGURO VIDA LEY D. LEG 688',
              pla10conceptoalias: '4220_SEG_VID_LEY_D._LEG_688',
              pla10flagclase: 'C',
              pla10flagimpresion: 'S',
              pla10flagactivo: 'S',
              pla10flagconfigurable: 'N',
              pla10tipoconceptocod: '03',
              pla10subtipoconceptocod: '07',
              pla10tipocalculocod: '01',
              pla10conceptosunatcod: '0803',
              pla10formula: '',
              pla10formulaalias: '',
              pla10comentario: '',
              pla10flagestandar: 'E',
              pla10conceptopadrecod: '',

              conceptotipodesc: 'Aportes',
              conceptosubtipodesc: 'Aportes',
              calculotipodesc: 'Calculo Planillas'
          },
          {
              pla10empresacod: '00032',
              pla10conceptocod: '4220',
              pla10conceptodesc: 'SENATI APORTE',
              pla10conceptoalias: '4216_SEN_APO',
              pla10flagclase: 'F',
              pla10flagimpresion: 'S',
              pla10flagactivo: 'S',
              pla10flagconfigurable: 'N',
              pla10tipoconceptocod: '03',
              pla10subtipoconceptocod: '07',
              pla10tipocalculocod: '01',
              pla10conceptosunatcod: '0807',
              pla10formula: "if V('0066')=INGNUMERO(1) then V('2016')*ParametroG('03') else INGNUMERO(0) end",
              pla10formulaalias: '',
              pla10comentario: '',
              pla10flagestandar: 'E',
              pla10conceptopadrecod: '',

              conceptotipodesc: 'Aportes',
              conceptosubtipodesc: 'Aportes',
              calculotipodesc: 'Calculo Planillas'
          }
    ];

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

    public GetConceptos(): Observable<Concepto[]>
    {
          return new Observable<Concepto[]>(observer => {
            observer.next(this.conceptoList);
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

    public CrearConcepto(concepto: Concepto): Observable<any> {
          const existe = this.conceptoList.some(c =>
              c.pla10empresacod === concepto.pla10empresacod &&
              c.pla10conceptocod === concepto.pla10conceptocod
          );

          return new Observable(observer => {
              if (existe) {
                  observer.error({ success: false, message: 'Ya existe un registro con ese código' });
              } else {
                  this.conceptoList.push({ ...concepto });
                  observer.next({ success: true, message: 'Registro guardado correctamente' });
                  observer.complete();
              }
          });
          //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
      }

      // Generar nuevo codigo
      // Spu_Pla_Trae_NuevoCodigoPersonalizado
      public GenerarNuevoCodigoConcepto(): string {
        const codigos = this.conceptoList.map(c => parseInt(c.pla10conceptocod, 10));
        const max = codigos.length > 0 ? Math.max(...codigos) : 0;
        const nuevoCodigo = (max + 1).toString().padStart(2, '0');
        return nuevoCodigo;
      }

    public ActualizarConcepto(concepto: Concepto): Observable<any> {

                  const index = this.conceptoList.findIndex(c =>
                      c.pla10empresacod === concepto.pla10empresacod &&
                      c.pla10conceptocod === concepto.pla10conceptocod
                  );

                  if (index !== -1) {
                      this.conceptoList[index] = { ...concepto };

                      return new Observable(observer => {
                        //console.log('Registro actualizado:', this.conceptoList[index]);
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
          return this.http.put<any>(urlmodificada, concepto);*/
      }

    public EliminarConcepto(idempresa: string, idconcepto: string): Observable<any> {
      const index = this.conceptoList.findIndex(c =>
          c.pla10empresacod === idempresa &&
          c.pla10conceptocod === idconcepto
        );

      return new Observable(observer => {
          if (index !== -1) {
              this.conceptoList.splice(index, 1);
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
      public getData(): Observable<Concepto[]> {
          return this.http.get<Concepto[]>(this.urlAPI);
      }
}
