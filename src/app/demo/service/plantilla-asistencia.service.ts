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

  public GetPlantillasAsistencia()
  //: Observable<PlantillaAsistencia[]>
  {
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

    public CrearPlantillaAsistencia(plantilla: PlantillaAsistencia): Observable<any> {
        return this.http.post<any>(this.urlAPI + '/SpCreate', plantilla);
    }

    public ActualizarPlantillaAsistencia(plantilla: PlantillaAsistencia): Observable<any> {
        let urlmodificada = this.urlAPI + '/SpUpdate';
        return this.http.put<any>(urlmodificada, plantilla);
    }

    public EliminarPlantillaAsistencia()
    //(idempresa: string, plantilla: string): Observable<any>
    {


        //let urlmodificada = `${this.urlAPI}/SpDelete?idempresa=${idempresa}&idbanco=${plantilla}`;
        //return this.http.delete<any>(urlmodificada);
    }

    public getData(): Observable<PlantillaAsistencia[]> {
        return this.http.get<PlantillaAsistencia[]>(this.urlAPI);
    }
}
