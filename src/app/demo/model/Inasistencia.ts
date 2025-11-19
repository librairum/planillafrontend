export interface Inasistencia{
    pla03tiposuspension: string;
    glo02descripcion: string;
    pla03fechainicio: Date;
    pla03fechafin: Date;
    pla03diasnotrabajados: number;
}

export interface PeriodoPago {
    label: string;
    value: string;
}

// Nueva interfaz para el Dropdown de Tipo de Suspensión
export interface TipoSuspension {
    code: string;
    name: string;
}


