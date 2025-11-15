export interface Calcular {
    pla01empleadocod: string;
    pla01docuidentidadnro: string;
    apellidosynombres: string;
    pla01fechaingreso: Date;
    pla57descripcion: string;
    pla51descripcion: string;
    calculoestado: string;
}

export interface DetalleProceso{
    pla10conceptocod: string;
    pla10conceptodesc: string;

    importe: number;
    boleta: string; //SI o NO
}

export interface Ajuste{
    pla10conceptocod: string;
    pla10conceptodesc: string;

    importe: number;
}