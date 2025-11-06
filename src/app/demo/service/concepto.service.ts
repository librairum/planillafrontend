/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { Concepto } from '../model/Concepto';
import { AfectacionSunat } from '../model/Concepto';

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
              pla10conceptocod: '4216',
              pla10conceptodesc: 'SENATI APORTE',
              pla10conceptoalias: '4216_SEN_APO',
              pla10flagclase: 'F',
              pla10flagimpresion: 'S',
              pla10flagactivo: 'S',
              pla10flagconfigurable: 'N',
              pla10tipocalculocod: '01',
              pla10tipoconceptocod: '03',
              pla10subtipoconceptocod: '07',
              pla10conceptosunatcod: '0807',
              pla10formula: "if V('0066')=INGNUMERO(1) then V('2016')*ParametroG('03') else INGNUMERO(0) end",
              pla10formulaalias: 'formula 2',
              pla10comentario: 'Ninguna observación',
              pla10flagestandar: 'S',
              pla10conceptopadrecod: '',

              pla10flagestandardesc: 'Estandar',

              calculotipodesc: 'Calculo Planillas',
              conceptotipodesc: 'Aportes',
              conceptosubtipodesc: 'Aportes',
              conceptosunatdesc: 'SENATI',

              afectacionesSunat: [
                { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR TRABAJADOR', valor: true },
                { codigo: '04', descripcion: 'ESSALUD SCTR', valor: true },
                { codigo: '07', descripcion: 'SENATI', valor: true },
                { codigo: '08', descripcion: 'SISTEMA NACIONAL DE PENSIONES 19990', valor: true },
                { codigo: '09', descripcion: 'SISTEMA PRIVADO DE PENSIONES', valor: true },
                { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA RETENCIONES', valor: true },
                { codigo: '15', descripcion: 'FONDO COMPLEMENTARIO DE JUBILACIÓN MINERA', valor: true }
              ],
              afectacionOtros: [
                { codigo: '13', descripcion: 'SEGURO VIDA LEY', valor: true },
                { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', valor: true },
                { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', valor: true },
                { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', valor: true },
                { codigo: '20', descripcion: 'INGRESOS VARIABLES PROMEDIO (VAC,GRA,CTS,5TA PROYECCION)', valor: true },
                { codigo: '21', descripcion: 'INGRESOS EXTRAORDINARIOS PARA 5TA CATEGORIA', valor: true }
              ],
              planillasAsignadas: [
                { codigo: '01', descripcion: 'Planilla Mensual', valor: false },
                { codigo: '02', descripcion: 'Planilla Vacaciones', valor: false },
                { codigo: '16', descripcion: 'Planilla Gratificaciones ley', valor: false },
                { codigo: '05', descripcion: 'Planilla Liquidaciones', valor: false },
                { codigo: '04', descripcion: 'Planilla Utilidades', valor: false },
                { codigo: '20', descripcion: 'Planilla Quincenal Adelanto', valor: false }
              ],
              regimenesLaborales: [
                { codigo: '01', descripcion: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728', valor: false },
                { codigo: '16', descripcion: 'MICROEMPRESA D. LEG. 1086 (1)', valor: false },
                { codigo: '17', descripcion: 'PEQUEÑA EMPRESA D. LEG. 1086 (1)', valor: false },
                { codigo: '18', descripcion: 'AGRARIO LEY 27360', valor: false },
                { codigo: '20', descripcion: 'MINEROS', valor: false }
              ]
          },
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
              pla10formula: "if V('0066')=INGNUMERO(1) then V('2016')*ParametroG('03') else INGNUMERO(0) end",
              pla10formulaalias: 'formula 1',
              pla10comentario: 'Ninguna observación',
              pla10flagestandar: 'S', // SN POR AHORA
              pla10conceptopadrecod: '',

              pla10flagestandardesc: 'Estandar',
              conceptotipodesc: 'Aportes',
              conceptosubtipodesc: 'Aportes',
              calculotipodesc: 'Calculo Planillas',
              conceptosunatdesc: 'PÓLIZA DE SEGURO - D. LEG. 688',

              afectacionesSunat: [
                { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR TRABAJADOR', valor: false },
                { codigo: '04', descripcion: 'ESSALUD SCTR', valor: false },
                { codigo: '07', descripcion: 'SENATI', valor: false },
                { codigo: '08', descripcion: 'SISTEMA NACIONAL DE PENSIONES 19990', valor: false },
                { codigo: '09', descripcion: 'SISTEMA PRIVADO DE PENSIONES', valor: false },
                { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA RETENCIONES', valor: false },
                { codigo: '15', descripcion: 'FONDO COMPLEMENTARIO DE JUBILACIÓN MINERA', valor: false }
              ],
              afectacionOtros: [
                { codigo: '13', descripcion: 'SEGURO VIDA LEY', valor: false },
                { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', valor: false },
                { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', valor: false },
                { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', valor: false },
                { codigo: '20', descripcion: 'INGRESOS VARIABLES PROMEDIO (VAC,GRA,CTS,5TA PROYECCION)', valor: false },
                { codigo: '21', descripcion: 'INGRESOS EXTRAORDINARIOS PARA 5TA CATEGORIA', valor: false }
              ],
              planillasAsignadas: [
                { codigo: '01', descripcion: 'Planilla Mensual', valor: true },
                { codigo: '02', descripcion: 'Planilla Vacaciones', valor: true },
                { codigo: '16', descripcion: 'Planilla Gratificaciones ley', valor: true },
                { codigo: '05', descripcion: 'Planilla Liquidaciones', valor: true },
                { codigo: '04', descripcion: 'Planilla Utilidades', valor: true },
                { codigo: '20', descripcion: 'Planilla Quincenal Adelanto', valor: true }
              ],
              regimenesLaborales: [
                { codigo: '01', descripcion: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728', valor: true },
                { codigo: '16', descripcion: 'MICROEMPRESA D. LEG. 1086 (1)', valor: true },
                { codigo: '17', descripcion: 'PEQUEÑA EMPRESA D. LEG. 1086 (1)', valor: true },
                { codigo: '18', descripcion: 'AGRARIO LEY 27360', valor: true },
                { codigo: '20', descripcion: 'MINEROS', valor: true }
              ]
          },
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
