/* Milton Garriazo */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
//import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

import { Trabajador } from '../model/Trabajador';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

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


  // los trabajadores estan abajo del codigo
  public trabajadorList: Trabajador[] = [
    trabajador1,
    trabajador2,
    trabajador3
  ]

      public GenerarNuevoCodigoTrabajador(): string {
        const codigos = this.trabajadorList.map(t => parseInt(t.pla01empleadocod, 10));
        const max = codigos.length > 0 ? Math.max(...codigos) : 0;
        const nuevoCodigo = (max + 1).toString().padStart(6, '0');
        return nuevoCodigo;
      }



      public GetTrabajadores(): Observable<Trabajador[]>
      {
            return new Observable<Trabajador[]>(observer => {
              observer.next(this.trabajadorList);
              observer.complete();
          });
        }


      public GetTrabajadorById(idempresa: string, idtrabajador: string): Observable<Trabajador | null> {
        const trabajador = this.trabajadorList.find(t =>
          t.pla01empresacod === idempresa &&
          t.pla01empleadocod === idtrabajador
        );

        return new Observable<Trabajador | null>(observer => {
          if (trabajador) {
            observer.next({ ...trabajador });
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      }

  public CrearTrabajador(trabajador: Trabajador): Observable<any> {
            const existe = this.trabajadorList.some(t =>
                t.pla01empresacod === trabajador.pla01empresacod &&
                t.pla01empleadocod === trabajador.pla01empleadocod
            );

            return new Observable(observer => {
                if (existe) {
                    observer.error({ success: false, message: 'Ya existe un registro con ese código' });
                } else {
                    this.trabajadorList.push({ ...trabajador });
                    observer.next({ success: true, message: 'Registro guardado correctamente' });
                    observer.complete();
                }
            });
            //return this.http.post<any>(this.urlAPI + '/SpCreate', regimen);
        }

  public ActualizarTrabajador(trabajador: Trabajador): Observable<any> {

                    const index = this.trabajadorList.findIndex(t =>
                        t.pla01empresacod === trabajador.pla01empresacod &&
                        t.pla01empleadocod === trabajador.pla01empleadocod
                    );

                    if (index !== -1) {
                        this.trabajadorList[index] = { ...trabajador };

                        return new Observable(observer => {
                          //console.log('Registro actualizado:', this.trabajadorList[index]);
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

  public EliminarTrabajador(idempresa: string, idtrabajador: string): Observable<any> {
        const index = this.trabajadorList.findIndex(t =>
            t.pla01empresacod === idempresa &&
            t.pla01empleadocod === idtrabajador
          );

        return new Observable(observer => {
            if (index !== -1) {
                this.trabajadorList.splice(index, 1);
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
        public getData(): Observable<Trabajador[]> {
            return this.http.get<Trabajador[]>(this.urlAPI);
        }


}

const trabajador1: Trabajador = {
      pla01empresacod: '00004', //pk
      pla01empleadocod: '000001', //pk
      pla01planillacod: '01',
      pla01docuidentidadtipo: '01',
      pla01docuidentidadnro: '12345678',

      pla01apepaterno: 'Pérez',
      pla01apematerno: 'García',
      pla01nombre1: 'Juan',
      pla01nombre2: 'Carlos',
      pla01direccion: 'Av. Siempre Viva 742',
      pla01fechanacimiento: new Date(1990, 0, 15),
      pla01telefono: '987654321',
      pla01fechaingreso: new Date(2020, 0, 15),
      pla01centrocostocod: '',

      //ocultos

      pla01fechacese: null as unknown as Date,
      pla01sexo: 'M',
      pla01estado: 'A',

      pla01puestocod: '',
      pla01ctaremunbancocod: '',
      pla01ctaremunumero: '',
      pla01ctaremunmoneda: '',

      // Reg laboral codigo y descripcion
      pla01trdatoslabregimenlaboral: '01',
      labregimenlaboraldes: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728',

      // Descripcion tipo documento
      tipdocdesc: 'DOC. NACIONAL DE IDENTIDAD',

      remuneraciones: [{
        pla05conceptocod: '0001',
        conceptodesc: 'Sueldo Mensual Básico',
        pla05importe: 3000
      },
      {
        pla05conceptocod: '0002',
        conceptodesc: 'Primera Quincena Importe Fijo',
        pla05importe: 1200
      }],

      regimenespensionarios: [{
          id: 1,
          pla31regpensionariocod: '21',
          desregpensionario: 'SPP INTEGRA',
          pla31regpensionariocupss: '551781MBCAV8',
          pla31fechaini: new Date(2005, 7, 16),
          pla31fechafin: new Date(2025, 0, 15),
          pla31flagcomisionmixta: '1'
        },
        {
          id: 2,
          pla31regpensionariocod: '22',
          desregpensionario: 'SPP PRIMA',
          pla31regpensionariocupss: '552781MBCAV9',
          pla31fechaini: new Date(2010, 5, 10),
          pla31fechafin: new Date(2030, 0, 10),
          pla31flagcomisionmixta: '0'
        }
      ],

      periodoslaborales: [{
        pla30codigo: '0001', //falta crear un metodo para obtener codigos
        pla30fechaini: new Date(2020, 0, 15),
        pla30fechafin: new Date(2021, 0, 15),
        desmotivocese: 'RENUNCIA'
      },
      {
        pla30codigo: '0002', //falta crear un metodo para obtener codigos
        pla30fechaini: new Date(2020, 0, 15),
        pla30fechafin: new Date(2021, 0, 15),
        desmotivocese: 'RENUNCIA CON INCENTIVOS'
      }
      ]
    }

const trabajador2: Trabajador = {
      pla01empresacod: '00004', //pk
      pla01empleadocod: '000002', //pk
      pla01planillacod: '01',
      pla01docuidentidadtipo: '01',
      pla01docuidentidadnro: '23456789',

      pla01apepaterno: 'Morales',
      pla01apematerno: 'Dúarez',
      pla01nombre1: 'Amanda',
      pla01nombre2: 'Cecilia',
      pla01direccion: 'Av. Ramon Herrera 142',
      pla01fechanacimiento: new Date(2000, 0, 14),
      pla01telefono: '987654000',
      pla01fechaingreso: new Date(2021, 0, 14),
      pla01centrocostocod: '',

      //ocultos

      pla01fechacese: null as unknown as Date,
      pla01sexo: 'F',
      pla01estado: 'A',

      pla01puestocod: '',
      pla01ctaremunbancocod: '',
      pla01ctaremunumero: '',
      pla01ctaremunmoneda: '',

      // Reg laboral codigo y descripcion
      pla01trdatoslabregimenlaboral: '01',
      labregimenlaboraldes: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728',

      // Descripcion tipo documento
      tipdocdesc: 'DOC. NACIONAL DE IDENTIDAD',

      remuneraciones: []
    }

const trabajador3: Trabajador = {
      pla01empresacod: '00004', //pk
      pla01empleadocod: '000003', //pk
      pla01planillacod: '01',
      pla01docuidentidadtipo: '01',
      pla01docuidentidadnro: '34567890',

      pla01apepaterno: 'Ramos',
      pla01apematerno: 'Flores',
      pla01nombre1: 'Carlos',
      pla01nombre2: '',
      pla01direccion: 'Av. La Paz 143',
      pla01fechanacimiento: new Date(1980, 0, 13),
      pla01telefono: '987654123',
      pla01fechaingreso: new Date(2022, 0, 13),
      pla01centrocostocod: '',

      //ocultos

      pla01fechacese: null as unknown as Date,
      pla01sexo: 'M',
      pla01estado: 'A',

      pla01puestocod: '',
      pla01ctaremunbancocod: '',
      pla01ctaremunumero: '',
      pla01ctaremunmoneda: '',

      // Reg laboral codigo y descripcion
      pla01trdatoslabregimenlaboral: '01',
      labregimenlaboraldes: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728',

      // Descripcion tipo documento
      tipdocdesc: 'DOC. NACIONAL DE IDENTIDAD',

      remuneraciones: []
    }
