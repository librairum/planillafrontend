export interface PlanillaGrupo {
  codigo: string;
  descripcion: string;
  tipoSueldoDes: string;
  frecuenciaPago: string;
  controlAsistencia: string;
}

export interface PlanillaGrupoView extends PlanillaGrupo {
  isEditing?: boolean;
  isNew?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
}
