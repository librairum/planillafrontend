import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- DEPENDENCIAS y MÓDULOS de PrimeNG ---
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';

// Nota: Dado que el modelo no está disponible, se define una interfaz de mock para asegurar la compilación.
export interface Asistencia {
  pla01empleadocod: string;
  apellidosynombres: string;
  pla01fechaingreso: Date;
  pla01estado: string;
  pla02utilidad: number;
  pla02gratificacion: number;
}

export interface AsistenciaView extends Asistencia {
  idIdentidad: string;
}

interface PeriodoPago {
  label: string;
  value: string;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    PanelModule,
    TagModule,
    PaginatorModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  // Usamos AsistenciaView para los datos del componente
  trabajadores: AsistenciaView[] = [];
  rowsPerPage: number = 10;
  selectedTrabajador: AsistenciaView | null = null;
  globalFilterValue: string = '';

  // Propiedades para Paginador Externo
  totalRecords: number = 0; // Total de registros
  first: number = 0; // Índice de la primera fila

  // Propiedad para simular el cierre del menú (cierra la vista)
  isMenuOpen: boolean = true;

  // --- PROPIEDADES PARA EL PERÍODO DE PAGO ---
  periodoPagoOptions: PeriodoPago[] = [
    { label: 'Planilla Utilidades - 20251', value: 'UTILIDADES' },
    { label: 'Planilla Gratificaciones ley - 20252', value: 'GRATIFICACIONES' }
  ];
  selectedPeriodoPago: string = 'UTILIDADES'; // Valor inicial por defecto

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadTrabajadores();
  }

  // Método de carga de datos (simulada)
  loadTrabajadores() {
    const fullData: AsistenciaView[] = [
      {
        pla01empleadocod: '000001',
        idIdentidad: '08680851',
        apellidosynombres: 'MARTINEZ GARCIA Joel alberto',
        pla01fechaingreso: new Date(2006, 7, 16),
        pla01estado: 'A',
        pla02utilidad: 180,
        pla02gratificacion: 150,
      },
      {
        pla01empleadocod: '000002',
        idIdentidad: '07271641',
        apellidosynombres: 'CALDERON PEREZ PYME',
        pla01fechaingreso: new Date(2006, 0, 1),
        pla01estado: 'A',
        pla02utilidad: 180,
        pla02gratificacion: 180,
      },
      {
        pla01empleadocod: '000003',
        idIdentidad: '10861418',
        apellidosynombres: 'SARMIENTO RENDON MYPE',
        pla01fechaingreso: new Date(2019, 0, 1),
        pla01estado: 'A',
        pla02utilidad: 100,
        pla02gratificacion: 100,
      },
      {
        pla01empleadocod: '000009',
        idIdentidad: '10890765',
        apellidosynombres: 'SNP SNP RegGeneralRP ',
        pla01fechaingreso: new Date(2020, 8, 1),
        pla01estado: 'A',
        pla02utilidad: 90,
        pla02gratificacion: 45,
      }
    ];

    this.totalRecords = fullData.length;
    this.trabajadores = fullData; // Se carga la lista inicial
  }

  // Método para paginación externa
  onPageChange(event: any) {
    this.first = event.first; // Índice de inicio
    this.rowsPerPage = event.rows; // Filas por página
  }

  getDynamicColumnLabel(): string {
    return this.selectedPeriodoPago === 'UTILIDADES' ? 'Días Utilidad' : 'Días Gratificación';
  }

  // --- FUNCIONES DE ACCIÓN CRUD/UTILIDAD (Implementación de PrimeNG) ---

  guardar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea guardar los cambios de asistencia?',
      header: 'Confirmar Guardado',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-success toolbar-button-text',
      rejectButtonStyleClass: 'p-button toolbar-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Se guardaron los datos de ${this.trabajadores.length} trabajadores correctamente`
        });
      }
    });
  }

  // Botón Cancelar (Cierra el menú)
  cancelar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar? Se perderán los cambios no guardados. (Esto cerrará el menú)',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger toolbar-button-text',
      rejectButtonStyleClass: 'p-button toolbar-button-text',
      accept: () => {
        this.loadTrabajadores();
        this.selectedTrabajador = null;
        this.isMenuOpen = false; // Simula el cierre de la vista/menú
        this.messageService.add({ severity: 'info', summary: 'Cerrando', detail: 'Vista cerrada. Operación cancelada.' });
      }
    });
  }

  /**
   * Confirma y ejecuta la eliminación/limpieza de la asistencia de *todos* los trabajadores 
   * para el período seleccionado.
   */
  eliminar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar la asistencia de todos los trabajadores para el período actual?',
      header: 'Confirmar Eliminación Masiva',
      icon: 'pi pi-trash',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger toolbar-button-text',
      rejectButtonStyleClass: 'p-button toolbar-button-text',
      accept: () => {
        this.trabajadores = this.trabajadores.map(t => {
          if (this.selectedPeriodoPago === 'UTILIDADES') {
            return { ...t, pla02utilidad: 0 };
          } else if (this.selectedPeriodoPago === 'GRATIFICACIONES') {
            return { ...t, pla02gratificacion: 0 };
          }
          return t;
        });

        // Forzar una actualización de la tabla modificando la referencia del array
        this.trabajadores = [...this.trabajadores];

        this.messageService.add({
          severity: 'warn',
          summary: 'Eliminado',
          detail: `Días de ${this.getDynamicColumnLabel()} eliminados para todos los trabajadores.`
        });
      }
    });
  }

  // Botón Vista Previa
  vistaPrevia() {
    this.messageService.add({
      severity: 'info',
      summary: 'Vista Previa',
      detail: 'Generando vista previa del reporte de asistencia...'
    });
    // Lógica para abrir modal o nueva ventana con la vista previa del reporte
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilterValue = value;
  }

  // --- FUNCIONES DE FORMATO DE TABLA ---

  getSeverity(estado: string): string {
    switch (estado) {
      case 'A': return 'success';
      case 'I': return 'danger';
      default: return 'warning';
    }
  }

  getEstadoLabel(estado: string): string {
    return estado === 'A' ? 'ACTIVO' : 'INACTIVO';
  }
}