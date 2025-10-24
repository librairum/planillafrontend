/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

//import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { PlantillaAsistencia } from '../model/PlantillaAsistencia';

@Injectable({
  providedIn: 'root'
})
export class PlantillaAsistenciaService {
  private http = inject(HttpClient);
  //apiUrl: string = ''; //
  urlAPI: string = ''; //
  apiUrl: any;

  plantillaAsistenciaList =  [
        { pla20empresacod: '00032',pla20plantillacod: '001', pla20descripcion: 'PLANILLA MENSUAL', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20empresacod: '00032',pla20plantillacod: '002', pla20descripcion: 'PLANILLA VACACIONES', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20empresacod: '00032',pla20plantillacod: '003', pla20descripcion: 'PLANILLA GRATIFICACIONES', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20empresacod: '00032',pla20plantillacod: '004', pla20descripcion: 'PLANILLA LIQUIDACION', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20empresacod: '00032',pla20plantillacod: '005', pla20descripcion: 'PLANILLA UTILIDAD', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20empresacod: '00032',pla20plantillacod: '006', pla20descripcion: 'PLANILLA ADELANTO', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' }
      ];

  constructor(
    private httpClient: HttpClient,
    //private configService: ConfigService
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

    public GetPlantillasAsistencia(): Observable<PlantillaAsistencia[]>
  {
        return new Observable<PlantillaAsistencia[]>(observer => {
          observer.next(this.plantillaAsistenciaList);
                observer.complete();
              });
  }

  //
  //Colocaremos el detalle de las plantillas de asistencia en este mismo servicio
  //

  public GetPlantillaAsistenciaDetalle(idempresa: string, idplantilla: string): Observable<PlantillaAsistencia | null>
  {
        const plantilla = this.plantillaAsistenciaList.find(p =>
              p.pla20empresacod === idempresa &&
              p.pla20plantillacod === idplantilla
          ) || null;
        return new Observable<PlantillaAsistencia | null>(observer => {
                observer.next(plantilla);
                observer.complete();
            });
  }

    public CrearPlantillaAsistencia(plantilla: PlantillaAsistencia): Observable<any> {
        const existe = this.plantillaAsistenciaList.some(p =>
                  p.pla20empresacod === plantilla.pla20empresacod &&
                  p.pla20plantillacod === plantilla.pla20plantillacod
              );

              return new Observable(observer => {
                  if (existe) {
                      observer.error({ success: false, message: 'Ya existe un registro con ese código' });
                  } else {
                      this.plantillaAsistenciaList.push({ ...plantilla });
                      observer.next({ success: true, message: 'Registro guardado correctamente' });
                      observer.complete();
                  }
              });
              //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
    }

    public ActualizarPlantillaAsistencia(plantilla: PlantillaAsistencia): Observable<any> {
        const index = this.plantillaAsistenciaList.findIndex(r =>
                          r.pla20plantillacod === plantilla.pla20plantillacod &&
                          r.pla20empresacod === plantilla.pla20empresacod
                      );

                      if (index !== -1) {
                          this.plantillaAsistenciaList[index] = { ...plantilla };

                          return new Observable(observer => {
                            //console.log('Registro actualizado:', this.plantillaAsistenciaList[index]);
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

    public EliminarPlantillaAsistencia(idempresa: string, idplantilla: string): Observable<any> {

    const index = this.plantillaAsistenciaList.findIndex(p =>
          p.pla20plantillacod === idplantilla &&
          p.pla20empresacod === idempresa
        );

          return new Observable(observer => {
              if (index !== -1) {
                  this.plantillaAsistenciaList.splice(index, 1);
                  observer.next({ success: true, message: 'Registro eliminado correctamente' });
                  observer.complete();
              } else {
                  observer.error({ success: false, message: 'No se encontró el registro para eliminar' });
              }
          });
              //let urlmodificada = `${this.urlAPI}/SpDelete?idempresa=${idempresa}&idbanco=${plantilla}`;
              //return this.http.delete<any>(urlmodificada);

    }

    public getData(): Observable<PlantillaAsistencia[]> {
        return this.http.get<PlantillaAsistencia[]>(this.urlAPI);
    }
}
