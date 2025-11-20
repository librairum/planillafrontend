import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';

// Importar las interfaces desde el archivo de modelo
import { PlanillaGrupo, PlanillaGrupoView, DropdownOption } from 'src/app/demo/model/PlanillaGrupo';

@Component({
  selector: 'app-planilla-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './planilla-grupo.component.html',
  styleUrls: ['./planilla-grupo.component.css']
})
export class PlanillaGrupoComponent implements OnInit {
  planillasGrupo: PlanillaGrupoView[] = [];
  originalPlanilla: PlanillaGrupoView | null = null;

  // Opciones para los dropdowns
  tiposSueldo: DropdownOption[] = [
    { label: 'Sueldo Mensual', value: 'Sueldo Mensual' },
    { label: 'Jornal Diario', value: 'Jornal Diario' },
    { label: 'Salario por Hora', value: 'Salario por Hora' }
  ];

  frecuenciasPago: DropdownOption[] = [
    { label: 'Pago Mensual', value: 'Pago Mensual' },
    { label: 'Pago Quincenal', value: 'Pago Quincenal' },
    { label: 'Pago Semanal', value: 'Pago Semanal' }
  ];

  controlesAsistencia: DropdownOption[] = [
    { label: 'Por Dias', value: 'Por Dias' },
    { label: 'Por Horas', value: 'Por Horas' },
    { label: 'Sin Control', value: 'Sin Control' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPlanillasGrupo();
  }

  loadPlanillasGrupo() {
    this.planillasGrupo = [
      {
        codigo: '01',
        descripcion: 'PLANILLA EMPLEADOS',
        tipoSueldoDes: 'Sueldo Mensual',
        frecuenciaPago: 'Pago Mensual',
        controlAsistencia: 'Por Dias'
      },
      {
        codigo: '02',
        descripcion: 'PLANILLA OBREROS',
        tipoSueldoDes: 'Jornal Diario',
        frecuenciaPago: 'Pago Mensual',
        controlAsistencia: 'Por Horas'
      },
      {
        codigo: '03',
        descripcion: 'PRACTICANTES',
        tipoSueldoDes: 'Sueldo Mensual',
        frecuenciaPago: 'Pago Mensual',
        controlAsistencia: 'Por Dias'
      }
    ];
  }

  agregarNuevo() {
    const editing = this.planillasGrupo.find(p => p.isEditing || p.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevaPlanilla: PlanillaGrupoView = {
      codigo: '',
      descripcion: '',
      tipoSueldoDes: '',
      frecuenciaPago: '',
      controlAsistencia: '',
      isEditing: true,
      isNew: true
    };
    this.planillasGrupo.push(nuevaPlanilla);
  }

  editar(planilla: PlanillaGrupoView) {
    const editing = this.planillasGrupo.find(p => p.isEditing);
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

  eliminar(planilla: PlanillaGrupoView, index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar esta planilla grupo?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.planillasGrupo.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Planilla grupo eliminada correctamente'
        });
      }
    });
  }

  cancelar(planilla: PlanillaGrupoView, index: number) {
    if (planilla.isNew) {
      this.planillasGrupo.splice(index, 1);
    } else {
      if (this.originalPlanilla) {
        planilla.codigo = this.originalPlanilla.codigo;
        planilla.descripcion = this.originalPlanilla.descripcion;
        planilla.tipoSueldoDes = this.originalPlanilla.tipoSueldoDes;
        planilla.frecuenciaPago = this.originalPlanilla.frecuenciaPago;
        planilla.controlAsistencia = this.originalPlanilla.controlAsistencia;
      }
      planilla.isEditing = false;
      this.originalPlanilla = null;
    }
  }

  guardar(planilla: PlanillaGrupoView, index: number) {
    if (!planilla.codigo || !planilla.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

    if (!planilla.tipoSueldoDes || !planilla.frecuenciaPago || !planilla.controlAsistencia) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar todos los campos'
      });
      return;
    }

    if (planilla.isNew) {
      const existe = this.planillasGrupo.find((p, i) =>
        i !== index && p.codigo === planilla.codigo
      );
      if (existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe una planilla grupo con este código'
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
      detail: 'Planilla grupo guardada correctamente'
    });
  }
}
