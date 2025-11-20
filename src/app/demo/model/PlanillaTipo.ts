export interface PlanillaTipo {
  codigo: string;
  descripcion: string;
}

export interface PlanillaTipoView extends PlanillaTipo {
  isEditing?: boolean;
  isNew?: boolean;
}
