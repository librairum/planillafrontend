// src/app/demo/model/PeriodoPago.ts

export interface PeriodoPago {
  pla01periodocod: string;
  pla01descripcion: string;
  
  pla01fechainicio: Date | null;
  pla01fechafin: Date | null;
  pla01fechapago: Date | null;

  pla01flagperiodocalculado: boolean;
  pla01flagfindemes: boolean;

  pla01flagperiodocerrado: boolean | null; 

  pla01fechaproceso: Date;
  Pla55Descripcion: string;
  pla01tipocambio: number;
}