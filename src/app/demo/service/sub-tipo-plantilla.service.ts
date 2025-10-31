/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { SubTipoPlanilla } from '../model/SubTipoPlanilla';

@Injectable({
  providedIn: 'root'
})
export class SubTipoPlantillaService {

  private http = inject(HttpClient);
  //apiUrl: string = ''; //
  urlAPI: string = ''; //
  apiUrl: any;

  public subTipoPlanillaList: SubTipoPlanilla[] = [
    {
        pla55empresacod: '00032',
        pla55planillatipocod: '01',
        pla55codigo: '01',
        pla55descripcion: 'Planilla Mensual',
        pla55conceptoxdefault: '3901',
        pla55flagactivo: 1,
        pla55plantillaasistenciacod: '001',
        pla55flagregulaaporteminessalud: '',


        planillaTipoDes: 'PLANILLA MENSUAL',
        conceptoxdefaultDes: 'NETO A PAGAR',
        plantillaAsistenciaDes: 'PLANILLA MENSUAL',
    },
    {
        pla55empresacod: '00032',
        pla55planillatipocod: '02',
        pla55codigo: '02',
        pla55descripcion: 'Planilla Vacaciones',
        pla55conceptoxdefault: '3901',
        pla55flagactivo: 1,
        pla55plantillaasistenciacod: '002',
        pla55flagregulaaporteminessalud: '',


        planillaTipoDes: 'PLANILLA VACACIONES',
        conceptoxdefaultDes: 'NETO A PAGAR',
        plantillaAsistenciaDes: 'PLANILLA VACACIONES'
    },
    {
        pla55empresacod: '00032',
        pla55planillatipocod: '03',
        pla55codigo: '03',
        pla55descripcion: 'Planilla Gratificaciones ley',
        pla55conceptoxdefault: '3901',
        pla55flagactivo: 1,
        pla55plantillaasistenciacod: '003',
        pla55flagregulaaporteminessalud: '',


        planillaTipoDes: 'PLANILLA GRATIFICACIONES',
        conceptoxdefaultDes: 'NETO A PAGAR',
        plantillaAsistenciaDes: 'PLANILLA GRATIFICACIONES'
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

      public GetSubTipoPlanillas(): Observable<SubTipoPlanilla[]>
      {
            return new Observable<SubTipoPlanilla[]>(observer => {
              observer.next(this.subTipoPlanillaList);
              observer.complete();
          });
        }

      public CrearSubTipoPlanilla(planilla: SubTipoPlanilla): Observable<any> {
            const existe = this.subTipoPlanillaList.some(sp =>
              sp.pla55empresacod === planilla.pla55empresacod &&
                sp.pla55planillatipocod === planilla.pla55planillatipocod &&
              sp.pla55codigo === planilla.pla55codigo
            );

            return new Observable(observer => {
                if (existe) {
                    observer.error({ success: false, message: 'Ya existe un registro con ese código' });
                } else {
                    this.subTipoPlanillaList.push({ ...planilla });
                    observer.next({ success: true, message: 'Registro guardado correctamente' });
                    observer.complete();
                }
            });
            //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
        }

        // Spu_Trae_PlanillaSubTipoCodigo
        public GenerarNuevoCodigoPlanilla(): string {
          const codigos = this.subTipoPlanillaList.map(sp => parseInt(sp.pla55codigo, 10));
          const max = codigos.length > 0 ? Math.max(...codigos) : 0;
          const nuevoCodigo = (max + 1).toString().padStart(2, '0');
          return nuevoCodigo;
        }

      public ActualizarSubTipoPlanilla(planilla: SubTipoPlanilla): Observable<any> {

                    const index = this.subTipoPlanillaList.findIndex(r =>
                        r.pla55empresacod === planilla.pla55empresacod &&
                        r.pla55planillatipocod === planilla.pla55planillatipocod &&
                        r.pla55codigo === planilla.pla55codigo
                    );

                    if (index !== -1) {
                        this.subTipoPlanillaList[index] = { ...planilla };

                        return new Observable(observer => {
                          //console.log('Registro actualizado:', this.subTipoPlanillaList[index]);
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

      public EliminarSubTipoPlanilla(idempresa: String, idtipo: String, codigo: String): Observable<any> {
        const index = this.subTipoPlanillaList.findIndex(p =>
            p.pla55empresacod === idempresa &&
            p.pla55planillatipocod === idtipo &&
            p.pla55codigo === codigo
        );

        return new Observable(observer => {
            if (index !== -1) {
                this.subTipoPlanillaList.splice(index, 1);
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
        public getData(): Observable<SubTipoPlanilla[]> {
            return this.http.get<SubTipoPlanilla[]>(this.urlAPI);
        }

}

