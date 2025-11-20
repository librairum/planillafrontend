export interface Usuario {
  id: string;
  nombre: string;
  clave: string;
  perfil: string;
}

export interface UsuarioView extends Usuario {
  isEditing?: boolean;
  isNew?: boolean;
}

export interface EmpresaUsuario {
  empresaCod: string;
  razonSocial: string;
  ruc: string;
  direccion: string;
  flagEstado: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
}
