import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

interface BaseAfectacion {
  codigo: string;
  descripcion: string;
  posicion: number;
  alias: string;
  activo: boolean;
  sunat: boolean;
  isEditing?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-base-afectacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './base-afectacion.component.html',
  styleUrls: ['./base-afectacion.component.css']
})
export class BaseAfectacionComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  basesAfectacion: BaseAfectacion[] = [];
  originalBase: BaseAfectacion | null = null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBasesAfectacion();
  }

  loadBasesAfectacion() {
    this.basesAfectacion = [
      { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR TRABAJADOR', posicion: 1, alias: 'ESSALUD', activo: true, sunat: true },
      { codigo: '02', descripcion: 'Essalud CBSSP Seguro TrabPesq', posicion: 2, alias: 'ESSALUDPES', activo: false, sunat: true },
      { codigo: '03', descripcion: 'Essalud Seguro Agrario Agricultor', posicion: 3, alias: 'ESSALUDAGR', activo: false, sunat: true },
      { codigo: '04', descripcion: 'ESSALUD SCTR', posicion: 4, alias: 'SCTR', activo: true, sunat: true },
      { codigo: '05', descripcion: 'Impuesto Extraord. Solidaridad', posicion: 5, alias: 'IES', activo: false, sunat: true },
      { codigo: '06', descripcion: 'Fondo Derechos Sociales Artista', posicion: 6, alias: 'FDSA', activo: false, sunat: true },
      { codigo: '07', descripcion: 'SENATI', posicion: 7, alias: 'SENATI', activo: true, sunat: true },
      { codigo: '08', descripcion: 'SISTEMA NACIONAL DE PENSIONES 19990', posicion: 8, alias: 'SNP', activo: true, sunat: true },
      { codigo: '09', descripcion: 'SISTEMA PRIVADO DE PENSIONES', posicion: 9, alias: 'SPP', activo: true, sunat: true },
      { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA RETENCIONES', posicion: 10, alias: 'R5TACR', activo: true, sunat: true },
      { codigo: '11', descripcion: 'Essalud Seguro Regular Pensionista', posicion: 11, alias: 'ESRP', activo: false, sunat: true },
      { codigo: '12', descripcion: 'Contrib. Solidaria Asistencia Previsional', posicion: 12, alias: 'CSAP', activo: false, sunat: true },
      { codigo: '13', descripcion: 'SEGURO VIDA LEY', posicion: 1, alias: 'SEG_VID_LEY', activo: true, sunat: false },
      { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', posicion: 14, alias: 'JUDIC', activo: true, sunat: false },
      { codigo: '15', descripcion: 'FONDO COMPLEMENTARIO DE JUBILACIÓN MINERA', posicion: 17, alias: 'FCJM', activo: true, sunat: true },
      { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', posicion: 1, alias: 'SCT_PEN_PRI', activo: true, sunat: false },
      { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', posicion: 15, alias: 'CTS6U', activo: true, sunat: false },
      { codigo: '20', descripcion: 'INGRESOS VARIABLES PROMEDIO (VAC,GRA,CTS,5TA PROYE', posicion: 1, alias: 'ING_VAR_PRO_IVA_PRO', activo: true, sunat: false },
      { codigo: '21', descripcion: 'INGRESOS EXTRAORDINARIOS PARA 5TA CATEGORIA', posicion: 1, alias: 'ING_EXT_5TA', activo: true, sunat: false }
    ];
  }

  // Agregar nueva base de afectación
  agregarNuevo() {
    // Verificar si ya hay una fila en edición
    const editing = this.basesAfectacion.find(b => b.isEditing || b.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevaBase: BaseAfectacion = {
      codigo: '',
      descripcion: '',
      posicion: 1,
      alias: '',
      activo: true,
      sunat: false,
      isEditing: true,
      isNew: true
    };
    
    // Agregar al inicio del array en lugar del final
    this.basesAfectacion.unshift(nuevaBase);
    
    // Ir a la primera página
    if (this.table) {
      this.table.first = 0;
    }
  }

  // Editar base de afectación
  editar(base: BaseAfectacion) {
    // Verificar si ya hay una fila en edición
    const editing = this.basesAfectacion.find(b => b.isEditing);
    if (editing && editing !== base) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual'
      });
      return;
    }

    // Guardar copia original
    this.originalBase = { ...base };
    base.isEditing = true;
  }

  // Eliminar base de afectación
  eliminar(base: BaseAfectacion, index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar esta base de afectación?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.basesAfectacion.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Base de afectación eliminada correctamente'
        });
      }
    });
  }

  // Cancelar edición
  cancelar(base: BaseAfectacion, index: number) {
    if (base.isNew) {
      // Si es nuevo, eliminarlo de la lista
      this.basesAfectacion.splice(index, 1);
    } else {
      // Si es edición, restaurar valores originales
      if (this.originalBase) {
        base.codigo = this.originalBase.codigo;
        base.descripcion = this.originalBase.descripcion;
        base.posicion = this.originalBase.posicion;
        base.alias = this.originalBase.alias;
        base.activo = this.originalBase.activo;
        base.sunat = this.originalBase.sunat;
      }
      base.isEditing = false;
      this.originalBase = null;
    }
  }

  // Guardar base de afectación
  guardar(base: BaseAfectacion, index: number) {
    // Validaciones
    if (!base.codigo || !base.descripcion || !base.alias) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código, descripción y alias son obligatorios'
      });
      return;
    }

    if (!base.posicion || base.posicion < 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La posición debe ser mayor a 0'
      });
      return;
    }

    // Si es nuevo, verificar código duplicado
    if (base.isNew) {
      const existe = this.basesAfectacion.find((b, i) => 
        i !== index && b.codigo === base.codigo
      );
      if (existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe una base de afectación con este código'
        });
        return;
      }
    }

    // Guardar
    base.isEditing = false;
    base.isNew = false;
    this.originalBase = null;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Base de afectación guardada correctamente'
    });
    
    // Reordenar: mover la base guardada al final
    const baseGuardada = this.basesAfectacion.splice(index, 1)[0];
    this.basesAfectacion.push(baseGuardada);
  }
}