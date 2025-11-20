export interface BaseAfectacion {
  codigo: string;
  descripcion: string;
  posicion: number;
  alias: string;
  activo: boolean;
  sunat: boolean;
}

export interface BaseAfectacionView extends BaseAfectacion {
  isEditing?: boolean;
  isNew?: boolean;
}
