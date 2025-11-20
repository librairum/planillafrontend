
export interface Banco {
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface BancoView extends Banco {
  isEditing?: boolean;
  isNew?: boolean;
}
