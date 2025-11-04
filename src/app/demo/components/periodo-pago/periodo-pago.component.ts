import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

interface Periodo {
  periodo: string;
  descripcion: string;
  fecInicio: Date;
  fecFinal: Date;
  calculado: boolean;
  flagFinMes: boolean;
  fecPago: Date;
  estado: string;
  fecProceso: Date;
  descSubTipoPlanilla: string;
  tipoCambio: number;
}

@Component({
  selector: 'app-periodo-pago',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './periodo-pago.component.html',
  styleUrls: ['./periodo-pago.component.css']
})
export class PeriodoPagoComponent implements OnInit {
  periodos: Periodo[] = [];
   rowsPerPage: number = 10; 
  selectedPeriodo: Periodo | null = null;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  isViewing: boolean = false;
  globalFilterValue: string = '';

  // Formulario
  periodoForm: Periodo = this.createEmptyPeriodo();

  // Opciones para dropdowns
  estadoOptions = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Cerrado', value: 'CERRADO' },
    { label: 'Procesado', value: 'PROCESADO' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPeriodos();
  }

  createEmptyPeriodo(): Periodo {
    return {
      periodo: '',
      descripcion: '',
      fecInicio: new Date(),
      fecFinal: new Date(),
      calculado: false,
      flagFinMes: false,
      fecPago: new Date(),
      estado: 'ACTIVO',
      fecProceso: new Date(),
      descSubTipoPlanilla: '',
      tipoCambio: 0
    };
  }

  loadPeriodos() {
    // Datos de ejemplo
    this.periodos = [
      {
        periodo: '202001',
        descripcion: 'Planilla Mensual - Enero 2020',
        fecInicio: new Date(2020, 0, 1),
        fecFinal: new Date(2020, 0, 31),
        calculado: true,
        flagFinMes: true,
        fecPago: new Date(2020, 1, 5),
        estado: 'CERRADO',
        fecProceso: new Date(2020, 1, 1),
        descSubTipoPlanilla: 'Empleados',
        tipoCambio: 3.35
      },
      {
        periodo: '202002',
        descripcion: 'Planilla Mensual - Febrero 2020',
        fecInicio: new Date(2020, 1, 1),
        fecFinal: new Date(2020, 1, 29),
        calculado: true,
        flagFinMes: true,
        fecPago: new Date(2020, 2, 5),
        estado: 'CERRADO',
        fecProceso: new Date(2020, 2, 1),
        descSubTipoPlanilla: 'Empleados',
        tipoCambio: 3.38
      },
      {
        periodo: '202003',
        descripcion: 'Planilla Mensual - Marzo 2020',
        fecInicio: new Date(2020, 2, 1),
        fecFinal: new Date(2020, 2, 31),
        calculado: false,
        flagFinMes: false,
        fecPago: new Date(2020, 3, 5),
        estado: 'ACTIVO',
        fecProceso: new Date(),
        descSubTipoPlanilla: 'Empleados',
        tipoCambio: 3.42
      }
    ];
  }

  // Acciones de la barra de herramientas
  agregar() {
    this.periodoForm = this.createEmptyPeriodo();
    this.isEditing = false;
    this.displayDialog = true;
  }

  modificar() {
    if (this.selectedPeriodo) {
      this.periodoForm = { ...this.selectedPeriodo };
      this.isEditing = true;
      this.displayDialog = true;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un periodo para modificar'
      });
    }
  }

  eliminar() {
    if (this.selectedPeriodo) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar este periodo?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.periodos = this.periodos.filter(p => p !== this.selectedPeriodo);
          this.selectedPeriodo = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Periodo eliminado correctamente'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un periodo para eliminar'
      });
    }
  }

  ver() {
    if (this.selectedPeriodo) {
    this.periodoForm = { ...this.selectedPeriodo };
    
    this.isEditing = false; 
    this.isViewing = true;  
    this.displayDialog = true;
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debe seleccionar un periodo para ver los detalles'
    });
  }
  }

  refrescar() {
    this.loadPeriodos();
    this.selectedPeriodo = null;
    this.globalFilterValue = '';
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Datos actualizados correctamente'
    });
  }

  abrirPeriodo() {
    if (this.selectedPeriodo) {
      if (this.selectedPeriodo.estado === 'CERRADO') {
        this.confirmationService.confirm({
          message: '¿Está seguro que desea abrir este periodo?',
          header: 'Confirmar Apertura',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.selectedPeriodo!.estado = 'ACTIVO';
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Periodo abierto correctamente'
            });
          }
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El periodo ya está abierto'
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un periodo'
      });
    }
  }

  cerrarPeriodo() {
    if (this.selectedPeriodo) {
      if (this.selectedPeriodo.estado === 'ACTIVO') {
        this.confirmationService.confirm({
          message: '¿Está seguro que desea cerrar este periodo? Esta acción no se puede deshacer.',
          header: 'Confirmar Cierre',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.selectedPeriodo!.estado = 'CERRADO';
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Periodo cerrado correctamente'
            });
          }
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El periodo ya está cerrado'
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un periodo'
      });
    }
  }

  // Guardar periodo
  guardarPeriodo() {
    if (this.isEditing) {
      const index = this.periodos.findIndex(p => p.periodo === this.periodoForm.periodo);
      if (index !== -1) {
        this.periodos[index] = { ...this.periodoForm };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Periodo actualizado correctamente'
      });
    } else {
      this.periodos.push({ ...this.periodoForm });
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Periodo creado correctamente'
      });
    }
    this.displayDialog = false;
    this.isViewing = false;
  }

  // Filtro global
  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilterValue = value;
  }

  // Severidad del estado
  getSeverity(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'success';
      case 'CERRADO':
        return 'danger';
      case 'PROCESADO':
        return 'info';
      default:
        return 'warning';
    }
  }
}