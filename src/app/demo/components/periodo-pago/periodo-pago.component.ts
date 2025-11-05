// src/app/periodo-pago/periodo-pago.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de PrimeNG
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

// Importar la interfaz de la entidad
// NOTA: Se asume que PeriodoPago y la ruta son correctas.
import { PeriodoPago } from 'src/app/demo/model/PeriodoPago';

// Importar funciones utilitarias
// NOTA: Se asume que las utilidades están disponibles en la ruta relativa.
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
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './periodo-pago.component.html',
  styleUrls: ['./periodo-pago.component.css']
})
export class PeriodoPagoComponent implements OnInit {
  // Se usa la interfaz del modelo
  periodos: PeriodoPago[] = [];
  rowsPerPage: number = 10;
  selectedPeriodo: PeriodoPago | null = null;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  isViewing: boolean = false;
  globalFilterValue: string = '';

  // Formulario usa la interfaz del modelo
  periodoForm: PeriodoPago = this.createEmptyPeriodo();

  // Opciones de estado (false=Activo, true=Cerrado. Null se usa para placeholder)
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
    // Inicializa las fechas y el estado en NULL para que los campos no estén seleccionados
    // y para activar la validación de obligatorio.
    return {
      pla01periodocod: '',
      pla01descripcion: '',
      pla01fechainicio: null,
      pla01fechafin: null,
      pla01flagperiodocalculado: false,
      pla01flagfindemes: false,
      pla01fechapago: null,
      pla01flagperiodocerrado: null, // Null para forzar la selección con placeholder
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
        pla01flagperiodocerrado: false, // Activo
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

  modificar() {
    if (this.selectedPeriodo) {
      this.periodoForm = { ...this.selectedPeriodo };
      this.isEditing = true;
      this.isViewing = false;
      this.displayDialog = true;
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo para modificar');
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
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button',
        accept: () => {
          this.periodos = this.periodos.filter(p => p.pla01periodocod !== this.selectedPeriodo!.pla01periodocod);
          this.selectedPeriodo = null;
          verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo eliminado correctamente');
        }
      });
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo para eliminar');
    }
  }

  ver() {
    if (this.selectedPeriodo) {
      this.periodoForm = { ...this.selectedPeriodo };
      this.isEditing = false;
      this.isViewing = true;
      this.displayDialog = true;
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo para ver los detalles');
    }
  }

  refrescar() {
    this.loadPeriodos();
    this.selectedPeriodo = null;
    this.globalFilterValue = '';
    verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Datos actualizados correctamente');
  }

  abrirPeriodo() {
    if (this.selectedPeriodo) {
      if (this.selectedPeriodo.pla01flagperiodocerrado === true) { // Si está CERRADO
        this.confirmationService.confirm({
          message: '¿Está seguro que desea abrir este periodo?',
          header: 'Confirmar Apertura',
          icon: 'pi pi-lock-open',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.selectedPeriodo!.pla01flagperiodocerrado = false; // Abrir
            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo abierto correctamente');
          }
        });
      } else {
        verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'El periodo ya está abierto');
      }
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo');
    }
  }

  cerrarPeriodo() {
    if (this.selectedPeriodo) {
      if (this.selectedPeriodo.pla01flagperiodocerrado === false) { // Si está ACTIVO/PROCESADO
        this.confirmationService.confirm({
          message: '¿Está seguro que desea cerrar este periodo? Esta acción no se puede deshacer.',
          header: 'Confirmar Cierre',
          icon: 'pi pi-lock',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.selectedPeriodo!.pla01flagperiodocerrado = true; // Cerrar
            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo cerrado correctamente');
          }
        });
      } else {
        verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'El periodo ya está cerrado');
      }
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un periodo');
    }
  }

  // Guardar periodo
  guardarPeriodo() {
    // 1. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    let errorMsg = '';

    // Validar Periodo (String)
    if (esVacio(this.periodoForm.pla01periodocod)) {
      errorMsg = 'El código de Periodo es obligatorio.';
    }
    // Validar Descripción (String) - Agregado para robustez
    else if (esVacio(this.periodoForm.pla01descripcion)) {
      errorMsg = 'La Descripción es obligatoria.';
    }
    // Validar Fechas (Inicio, Fin, Pago)
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

    // 2. PROCESAMIENTO

    // Uso de aMayusculas antes de guardar
    this.periodoForm.pla01descripcion = aMayusculas(this.periodoForm.pla01descripcion);

    if (this.isEditing) {
      // Buscar el índice por la clave única
      const index = this.periodos.findIndex(p => p.pla01periodocod === this.periodoForm.pla01periodocod);
      if (index !== -1) {
        this.periodos[index] = { ...this.periodoForm } as PeriodoPago;
      }
      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Periodo actualizado correctamente');
    } else {
      // Validar si el periodo ya existe (solo por seguridad en el ejemplo)
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

  // Mapea el booleano 'pla01flagperiodocerrado' a un estado de texto
  getPeriodoEstado(isCerrado: boolean, descSubTipoPlanilla: string): string {
    if (isCerrado) {
      return 'Cerrado';
    }
    // Si no está cerrado, asumimos 'Activo' (el estado de trabajo).
    return 'Activo';
  }

  // Se mantiene por si se quisiera reutilizar la lógica de color, aunque el HTML usa CSS
  getSeverity(isCerrado: boolean): string {
    return isCerrado ? 'danger' : 'success';
  }
}