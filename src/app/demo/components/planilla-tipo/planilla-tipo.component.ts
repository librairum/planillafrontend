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

// Importar las interfaces desde el archivo de modelo
import { PlanillaTipo, PlanillaTipoView } from 'src/app/demo/model/PlanillaTipo';

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
  planillasTipo: PlanillaTipoView[] = [];
  originalPlanilla: PlanillaTipoView | null = null;

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

  agregarNuevo() {
    const editing = this.planillasTipo.find(p => p.isEditing || p.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevaPlanilla: PlanillaTipoView = {
      codigo: '',
      descripcion: '',
      isEditing: true,
      isNew: true
    };
    this.planillasTipo.push(nuevaPlanilla);
  }

  editar(planilla: PlanillaTipoView) {
    const editing = this.planillasTipo.find(p => p.isEditing);
    if (editing && editing !== planilla) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual'
      });
      return;
    }

    this.originalPlanilla = { ...planilla };
    planilla.isEditing = true;
  }

  eliminar(planilla: PlanillaTipoView, index: number) {
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

  cancelar(planilla: PlanillaTipoView, index: number) {
    if (planilla.isNew) {
      this.planillasTipo.splice(index, 1);
    } else {
      if (this.originalPlanilla) {
        planilla.codigo = this.originalPlanilla.codigo;
        planilla.descripcion = this.originalPlanilla.descripcion;
      }
      planilla.isEditing = false;
      this.originalPlanilla = null;
    }
  }

  guardar(planilla: PlanillaTipoView, index: number) {
    if (!planilla.codigo || !planilla.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

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
