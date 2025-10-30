import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

// Interfaces
interface Usuario {
  id: string;
  nombre: string;
  clave: string;
  perfil: string;
  isEditing?: boolean;
  isNew?: boolean;
}

interface EmpresaUsuario {
  empresaCod: string;
  razonSocial: string;
  ruc: string;
  direccion: string;
  flagEstado: boolean;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    CheckboxModule,
    PasswordModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  
  // --- Tabla Maestra ---
  usuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  originalUsuario: Usuario | null = null;
  perfiles: DropdownOption[] = [];

  // --- Tabla Detalle ---
  empresasUsuario: EmpresaUsuario[] = [];
  private allEmpresasMap: Map<string, EmpresaUsuario[]> = new Map(); // Mapa para simular la data

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPerfiles();
    this.loadAllEmpresasData(); // Cargar data de simulación
    this.loadUsuarios();
  }

  // --- Carga de Datos (Simulación) ---

  loadUsuarios() {
    this.usuarios = [
      { 
        id: 'admin', 
        nombre: 'Administrador Master', 
        clave: 'admn$1',
        perfil: 'Administrador General'
      },
      { 
        id: 'melissa', 
        nombre: 'Usuario de Consulta', 
        clave: 'melissa',
        perfil: 'Usuario Consulta'
      }
    ];
    
    // Seleccionar el primer usuario y cargar sus empresas
    if (this.usuarios.length > 0) {
      this.selectedUsuario = this.usuarios[0];
      this.empresasUsuario = this.allEmpresasMap.get(this.selectedUsuario.id) || [];
    }
  }

  loadPerfiles() {
    this.perfiles = [
      { label: 'Administrador General', value: 'Administrador General' },
      { label: 'Usuario Consulta', value: 'Usuario Consulta' },
      { label: 'Usuario RRHH', value: 'Usuario RRHH' }
    ];
  }

  loadAllEmpresasData() {
    // Simula la data de empresas para cada usuario
    this.allEmpresasMap.set('admin', [
      { empresaCod: '00004', razonSocial: 'ADMINISTRAR Y CONFIGURAR MASTERPLA', ruc: '20602193676', direccion: 'AV. ALFREDO MALDONADO NRO 654', flagEstado: true }
    ]);
    this.allEmpresasMap.set('user01', [
      { empresaCod: '00004', razonSocial: 'ADMINISTRAR Y CONFIGURAR MASTERPLA', ruc: '20602193676', direccion: 'AV. ALFREDO MALDONADO NRO 654', flagEstado: false },
      { empresaCod: '00005', razonSocial: 'SERVICIOS GENERALES S.R.L.', ruc: '20501145234', direccion: 'AV. ALFREDO MALDONADO NRO 654', flagEstado: true }
    ]);
  }

  // --- Lógica Maestro-Detalle ---

  onUsuarioSelect(event: any) {
    if (this.usuarios.find(u => u.isEditing)) {
      // Si hay una fila en edición, no permitir cambiar de selección
      this.selectedUsuario = event.previousValue; 
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Guarde o cancele la edición actual antes de cambiar de usuario'
      });
      // Forzar que la selección de la tabla vuelva a la fila en edición
      setTimeout(() => {
        this.selectedUsuario = this.usuarios.find(u => u.isEditing) || event.previousValue;
      }, 0);
      return;
    }
    // Cargar las empresas del usuario seleccionado
    this.empresasUsuario = this.allEmpresasMap.get(event.data.id) || [];
  }


  // --- Lógica de Edición (Tabla Maestra) ---

  agregarNuevo() {
    const editing = this.usuarios.find(u => u.isEditing || u.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevoUsuario: Usuario = {
      id: '',
      nombre: '',
      clave: '',
      perfil: '',
      isEditing: true,
      isNew: true
    };
    this.usuarios.push(nuevoUsuario);
    this.selectedUsuario = nuevoUsuario; // Seleccionar la nueva fila
    this.empresasUsuario = []; // Limpiar la tabla de detalle
  }

  editar(usuario: Usuario) {
    const editing = this.usuarios.find(u => u.isEditing);
    if (editing && editing !== usuario) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual'
      });
      return;
    }

    this.originalUsuario = { ...usuario };
    usuario.isEditing = true;
  }

  eliminar(usuario: Usuario, index: number) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar al usuario '${usuario.nombre}'?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.usuarios.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario eliminado correctamente'
        });
        // Limpiar detalle si el usuario eliminado era el seleccionado
        if (this.selectedUsuario === usuario) {
          this.selectedUsuario = null;
          this.empresasUsuario = [];
        }
      }
    });
  }

  cancelar(usuario: Usuario, index: number) {
    if (usuario.isNew) {
      this.usuarios.splice(index, 1);
      this.selectedUsuario = this.usuarios.length > 0 ? this.usuarios[0] : null; // Volver al primer usuario
    } else {
      if (this.originalUsuario) {
        this.usuarios[index] = { ...this.originalUsuario };
      }
      this.usuarios[index].isEditing = false;
      this.originalUsuario = null;
    }
    // Recargar empresas del usuario seleccionado
    if(this.selectedUsuario) {
      this.empresasUsuario = this.allEmpresasMap.get(this.selectedUsuario.id) || [];
    } else {
      this.empresasUsuario = [];
    }
  }

  guardar(usuario: Usuario, index: number) {
    if (!usuario.id || !usuario.nombre || !usuario.clave || !usuario.perfil) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos (Id, Nombre, Clave y Perfil) son obligatorios'
      });
      return;
    }

    if (usuario.isNew) {
      const existe = this.usuarios.find((u, i) => i !== index && u.id === usuario.id);
      if (existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe un usuario con este Id'
        });
        return;
      }
      // Simular la adición de data de empresas para el nuevo usuario
      this.allEmpresasMap.set(usuario.id, []);
    }

    usuario.isEditing = false;
    usuario.isNew = false;
    this.originalUsuario = null;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario guardado correctamente'
    });
  }
}