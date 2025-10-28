/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

//import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { PlantillaAsistencia } from '../model/PlantillaAsistencia';
import { PlantillaAsistenciaDetalle } from '../model/PlantillaAsistenciaDetalle';

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

    // Nuevo método para generar el siguiente código correlativo
    // Spu_Pla_Trae_CodigoPlantillaCabecera
    public GenerarNuevoCodigoPlantilla(): string {
      const codigos = this.plantillaAsistenciaList.map(p => parseInt(p.pla20plantillacod, 10));
      const max = codigos.length > 0 ? Math.max(...codigos) : 0;
      const nuevoCodigo = (max + 1).toString().padStart(3, '0');
      return nuevoCodigo;
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

    // DETALLES

    // Mock data centralizado para detalles (mejor organizar aquí)
    //Borrar luego
    mockDetalleData: PlantillaAsistenciaDetalle[] = [
      // details for plantilla 001
      { pla21empresacod:'00032', pla21plantillacod:'001', pla21correlativo: 1, pla21camponombre:'Pla01CampoA', pla21campoalias:'Campo A'},
      { pla21empresacod:'00032', pla21plantillacod:'001', pla21correlativo: 2, pla21camponombre:'Pla01CampoB', pla21campoalias:'Campo B'},

      // details for plantilla 002
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 1, pla21camponombre:'Pla02VacacionesFisicas', pla21campoalias:'Dias Fisicos', estado: 1},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 2, pla21camponombre:'Pla02VacacionesVendidas', pla21campoalias:'Dias Vendidas', estado: 1},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 3, pla21camponombre:'Pla02VacaFechaIni', pla21campoalias:'Fecha Inicio', estado: 1},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 4, pla21camponombre:'Pla02VacaFechaFin', pla21campoalias:'Fecha Fin', estado: 1},

      // details for plantilla 003
      { pla21empresacod:'00032', pla21plantillacod:'003', pla21correlativo: 1, pla21camponombre:'Pla03CampoA', pla21campoalias:'Campo A'},
      { pla21empresacod:'00032', pla21plantillacod:'003', pla21correlativo: 2, pla21camponombre:'Pla03CampoB', pla21campoalias:'Campo B'},

      // other empresas / ejemplos
      { pla21empresacod:'00032', pla21plantillacod:'004', pla21correlativo: 1, pla21camponombre:'Pla04CampoA', pla21campoalias:'Campo A'}
    ];

    // Obtiene los detalles por código de plantilla y empresa
    // select * from Spu_Pla_Trae_CamposPlantillaDetalle('00032','002')

    public GetPlantillaAsistenciaDetalleList(pla20plantillacod: string, pla20empresacod: string): Observable<PlantillaAsistenciaDetalle[]> {
      let detalles = this.mockDetalleData.filter(d => d.pla21plantillacod === pla20plantillacod && d.pla21empresacod === pla20empresacod);
      if (pla20empresacod) {
        detalles = detalles.filter(d => d.pla21empresacod === pla20empresacod && d.pla21plantillacod === pla20plantillacod);
      }
      return new Observable<PlantillaAsistenciaDetalle[]>(observer => {
        observer.next([...detalles]);
        observer.complete();
      });
    }

    // Método para actualizar los estados
    public GuardarEstadosDetalle(plantillaDetalleList: PlantillaAsistenciaDetalle[]): Observable<any> {
      plantillaDetalleList.forEach(det => {
        const idx = this.mockDetalleData.findIndex(d =>
          d.pla21empresacod === det.pla21empresacod &&
          d.pla21plantillacod === det.pla21plantillacod &&
          d.pla21correlativo === det.pla21correlativo
        );
        if (idx !== -1) {
          this.mockDetalleData[idx].estado = det.estado;
        }
      });
      return new Observable(observer => {
        observer.next({ success: true, message: 'Estados actualizados correctamente' });
        observer.complete();
      });
    }
}
