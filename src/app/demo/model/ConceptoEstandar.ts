// Interface para el listado de conceptos
export interface ConceptoEstandar {
  codigo: string;
  descripcion: string;
  impresion: string;
  activo: string;
  configurable: string;
  conceptoSunat: string;
  conceptoTipoDesc: string;
  conceptoSubTipoc: string;
  tipo: string;
}

// Interfaces para el detalle del concepto
export interface TipoCalculo {
  codigo: string;
  descripcion: string;
}

export interface ConceptoTipo {
  codigo: string;
  descripcion: string;
}

export interface SubTipoConcepto {
  conceptoTipoCod: string;
  codigo: string;
  descripcion: string;
}

export interface ConceptoSunat {
  codigoSunat: string;
  descripcion: string;
}

export interface AfectacionItem {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

// Interface para el modelo completo del concepto en el detalle
export interface ConceptoEstandarDetalle {
  codigo: string;
  descripcion: string;
  imprimible: boolean;
  configBasica: boolean;
  formulable: boolean;
  activo: boolean;
  observacion: string;
  afectacionesSunat: AfectacionItem[];
  afectacionOtros: AfectacionItem[];
  planillasAsignadas: AfectacionItem[];
  regimenesLaborales: AfectacionItem[];
}
