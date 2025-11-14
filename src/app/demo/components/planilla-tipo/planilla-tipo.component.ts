import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';

interface PlanillaTipo {
  codigo: string;
  descripcion: string;
  isEditing?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-planilla-tipo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './planilla-tipo.component.html',
  styleUrls: ['./planilla-tipo.component.css']
})
export class PlanillaTipoComponent implements OnInit {
  planillasTipo: PlanillaTipo[] = [];
  originalPlanilla: PlanillaTipo | null = null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPlanillasTipo();
  }

  loadPlanillasTipo() {
    this.planillasTipo = [
      { codigo: '01', descripcion: 'PLANILLA MENSUAL' },
      { codigo: '02', descripcion: 'PLANILLA VACACIONES' },
      { codigo: '03', descripcion: 'PLANILLA GRATIFICACIONES' },
      { codigo: '04', descripcion: 'PLANILLA LIQUIDACION' },
      { codigo: '05', descripcion: 'PLANILLA UTILIDAD' },
      { codigo: '06', descripcion: 'PLANILLA ADELANTO' }
    ];
  }

  // Agregar nueva planilla tipo
  agregarNuevo() {
    // Verificar si ya hay una fila en edición
    const editing = this.planillasTipo.find(p => p.isEditing || p.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevaPlanilla: PlanillaTipo = {
      codigo: '',
      descripcion: '',
      isEditing: true,
      isNew: true
    };
    this.planillasTipo.push(nuevaPlanilla);
  }

  // Editar planilla tipo
  editar(planilla: PlanillaTipo) {
    // Verificar si ya hay una fila en edición
    const editing = this.planillasTipo.find(p => p.isEditing);
    if (editing && editing !== planilla) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual'
      });
      return;
    }

    // Guardar copia original
    this.originalPlanilla = { ...planilla };
    planilla.isEditing = true;
  }

  // Eliminar planilla tipo
  eliminar(planilla: PlanillaTipo, index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar esta planilla tipo?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.planillasTipo.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Planilla tipo eliminada correctamente'
        });
      }
    });
  }

  // Cancelar edición
  cancelar(planilla: PlanillaTipo, index: number) {
    if (planilla.isNew) {
      // Si es nuevo, eliminarlo de la lista
      this.planillasTipo.splice(index, 1);
    } else {
      // Si es edición, restaurar valores originales
      if (this.originalPlanilla) {
        planilla.codigo = this.originalPlanilla.codigo;
        planilla.descripcion = this.originalPlanilla.descripcion;
      }
      planilla.isEditing = false;
      this.originalPlanilla = null;
    }
  }

  // Guardar planilla tipo
  guardar(planilla: PlanillaTipo, index: number) {
    // Validaciones
    if (!planilla.codigo || !planilla.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

    // Si es nuevo, verificar código duplicado
    if (planilla.isNew) {
      const existe = this.planillasTipo.find((p, i) =>
        i !== index && p.codigo === planilla.codigo
      );
      if (existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe una planilla tipo con este código'
        });
        return;
      }
    }

    // Guardar
    planilla.isEditing = false;
    planilla.isNew = false;
    this.originalPlanilla = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Planilla tipo guardada correctamente'
    });
  }
}
