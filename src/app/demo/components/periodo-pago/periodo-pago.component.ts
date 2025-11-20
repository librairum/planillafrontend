// src/app/periodo-pago/periodo-pago.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';

import { PeriodoPago } from 'src/app/demo/model/PeriodoPago';

import { verMensajeInformativo, aMayusculas, esVacio, esFechaValida } from '../utilities/funciones_utilitarias';

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
    TagModule,
    PanelModule,
    InputNumberModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './periodo-pago.component.html',
  styleUrls: ['./periodo-pago.component.css']
})
export class PeriodoPagoComponent implements OnInit {
  periodos: PeriodoPago[] = [];
  rowsPerPage: number = 10;
  selectedPeriodo: PeriodoPago | null = null;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  isViewing: boolean = false;
  globalFilterValue: string = '';

  // Formulario usa la interfaz del modelo
  periodoForm: PeriodoPago = this.createEmptyPeriodo();

  estadoOptions = [
    { label: 'Activo', value: false },
    { label: 'Cerrado', value: true }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadPeriodos();
  }

  createEmptyPeriodo(): PeriodoPago {
    return {
      pla01periodocod: '',
      pla01descripcion: '',
      pla01fechainicio: null,
      pla01fechafin: null,
      pla01flagperiodocalculado: false,
      pla01flagfindemes: false,
      pla01fechapago: null,
      pla01flagperiodocerrado: null, 
      pla01fechaproceso: new Date(),
      Pla55Descripcion: '',
      pla01tipocambio: 0
    } as PeriodoPago;
  }

  loadPeriodos() {
    // Datos de ejemplo mapeados a la interfaz PeriodoPago
    this.periodos = [
      {
        pla01periodocod: '202001',
        pla01descripcion: 'Planilla Mensual - Enero 2020',
        pla01fechainicio: new Date(2020, 0, 1),
        pla01fechafin: new Date(2020, 0, 31),
        pla01flagperiodocalculado: true,
        pla01flagfindemes: true,
        pla01fechapago: new Date(2020, 1, 5),
        pla01flagperiodocerrado: true, // Cerrado
        pla01fechaproceso: new Date(2020, 1, 1),
        Pla55Descripcion: 'Planilla Vacaciones',
        pla01tipocambio: 3.35
      },
      {
        pla01periodocod: '202002',
        pla01descripcion: 'Planilla Mensual - Febrero 2020',
        pla01fechainicio: new Date(2020, 1, 1),
        pla01fechafin: new Date(2020, 1, 29),
        pla01flagperiodocalculado: true,
        pla01flagfindemes: true,
        pla01fechapago: new Date(2020, 2, 5),
        pla01flagperiodocerrado: false, // Activo
        pla01fechaproceso: new Date(2020, 2, 1),
        Pla55Descripcion: 'Planilla Utilidades',
        pla01tipocambio: 3.38
      },
      {
        pla01periodocod: '202003',
        pla01descripcion: 'Planilla Mensual - Marzo 2020',
        pla01fechainicio: new Date(2020, 2, 1),
        pla01fechafin: new Date(2020, 2, 31),
        pla01flagperiodocalculado: false,
        pla01flagfindemes: false,
        pla01fechapago: new Date(2020, 3, 5),
        pla01flagperiodocerrado: false, 
        pla01fechaproceso: new Date(),
        Pla55Descripcion: 'Empleados',
        pla01tipocambio: 3.42
      }
    ];
  }

  // Métodos de la barra de herramientas
  agregar() {
    this.periodoForm = this.createEmptyPeriodo();
    this.isEditing = false;
    this.isViewing = false;
    this.displayDialog = true;
  }

  refrescar() {
    this.loadPeriodos();
    this.selectedPeriodo = null;
    this.globalFilterValue = '';
    verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Datos actualizados correctamente');
  }

  // Nuevos métodos para las acciones de la tabla
  onEdit(periodo: PeriodoPago) {
    this.selectedPeriodo = periodo;
    this.periodoForm = { ...periodo };
    this.isEditing = true;
    this.isViewing = false;
    this.displayDialog = true;
  }

  onDelete(periodo: PeriodoPago) {
    this.selectedPeriodo = periodo;
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el periodo ${periodo.pla01periodocod}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        this.periodos = this.periodos.filter(p => p.pla01periodocod !== periodo.pla01periodocod);
        this.selectedPeriodo = null;
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo eliminado correctamente');
      }
    });
  }

  onView(periodo: PeriodoPago) {
    this.selectedPeriodo = periodo;
    this.periodoForm = { ...periodo };
    this.isEditing = false;
    this.isViewing = true;
    this.displayDialog = true;
  }

  // Método unificado para Abrir/Cerrar Periodo
  togglePeriodoEstado() {
    if (!this.selectedPeriodo) {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo');
      return;
    }

    const isCerrado = this.selectedPeriodo.pla01flagperiodocerrado;
    const accion = isCerrado ? 'Abrir' : 'Cerrar';
    const mensaje = isCerrado
      ? `¿Está seguro que desea ${accion} el periodo ${this.selectedPeriodo.pla01periodocod}?`
      : `¿Está seguro que desea ${accion} el periodo ${this.selectedPeriodo.pla01periodocod}? Esta acción no se puede deshacer.`;
    const icon = isCerrado ? 'pi pi-lock-open' : 'pi pi-lock';

    this.confirmationService.confirm({
      message: mensaje,
      header: `Confirmar ${accion}`,
      icon: icon,
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        this.selectedPeriodo!.pla01flagperiodocerrado = !isCerrado;
        verMensajeInformativo(this.messageService, 'success', 'Éxito', `Periodo ${isCerrado ? 'abierto' : 'cerrado'} correctamente`);
      }
    });
  }

  // Guardar periodo
  guardarPeriodo() {
    // 1. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    let errorMsg = '';

    if (esVacio(this.periodoForm.pla01periodocod)) {
      errorMsg = 'El código de Periodo es obligatorio.';
    }

    else if (esVacio(this.periodoForm.pla01descripcion)) {
      errorMsg = 'La Descripción es obligatoria.';
    }

    else if (!esFechaValida(this.periodoForm.pla01fechainicio)) {
      errorMsg = 'La Fecha de Inicio es obligatoria.';
    }
    else if (!esFechaValida(this.periodoForm.pla01fechafin)) {
      errorMsg = 'La Fecha Final es obligatoria.';
    }
    else if (!esFechaValida(this.periodoForm.pla01fechapago)) {
      errorMsg = 'La Fecha de Pago es obligatoria.';
    }
    // Validar Estado (Booleano/Null)
    else if (this.periodoForm.pla01flagperiodocerrado === null || this.periodoForm.pla01flagperiodocerrado === undefined) {
      errorMsg = 'El Estado es obligatorio.';
    }

    if (errorMsg) {
      verMensajeInformativo(this.messageService, 'error', 'Error de Validación', errorMsg);
      return;
    }


    this.periodoForm.pla01descripcion = aMayusculas(this.periodoForm.pla01descripcion);

    if (this.isEditing) {
      const index = this.periodos.findIndex(p => p.pla01periodocod === this.periodoForm.pla01periodocod);
      if (index !== -1) {
        this.periodos[index] = { ...this.periodoForm } as PeriodoPago;
      }
      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo actualizado correctamente');
    } else {
      const exists = this.periodos.some(p => p.pla01periodocod === this.periodoForm.pla01periodocod);
      if (exists) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'El periodo ya existe');
        return;
      }
      this.periodos.push({ ...this.periodoForm } as PeriodoPago);
      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo creado correctamente');
    }
    this.displayDialog = false;
    this.isViewing = false;
  }

  getPeriodoEstado(isCerrado: boolean, descSubTipoPlanilla: string): string {
    if (isCerrado) {
      return 'Cerrado';
    }
    return 'Activo';
  }

  getSeverity(isCerrado: boolean): string {
    return isCerrado ? 'danger' : 'success';
  }
}