import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { 
    verMensajeInformativo, 
    esFechaValida, 
    formatearFecha 
} from 'src/app/demo/components/utilities/funciones_utilitarias'; 

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';

import { Asistencia } from 'src/app/demo/model/Asistencia';

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
        PaginatorModule,
        DialogModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './asistencia.component.html',
    styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

    // RENOMBRADO: De 'trabajadores' a 'empleados' (La fuente de datos)
    empleados: AsistenciaView[] = []; 
    rowsPerPage: number = 10;
    // RENOMBRADO: De 'selectedTrabajador' a 'selectedEmpleado'
    selectedEmpleado: AsistenciaView | null = null; 

    totalRecords: number = 0;
    first: number = 0;
    isMenuOpen: boolean = true;

    displayInasistenciaDialog: boolean = false;
    // RENOMBRADO: De 'selectedInasistenciaTrabajador' a 'selectedInasistenciaEmpleado'
    selectedInasistenciaEmpleado: AsistenciaView | null = null; 
    

    periodoPagoOptions: PeriodoPago[] = [
        { label: 'Planilla Utilidades - 20251', value: 'UTILIDADES' },
        { label: 'Planilla Gratificaciones ley - 20252', value: 'GRATIFICACIONES' }
    ];
    selectedPeriodoPago: string = 'UTILIDADES';

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService 
    ) { }

    ngOnInit() {
        this.loadEmpleados(); 
    }

    loadEmpleados() {
        // ... (Simulación de datos) ...
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
        this.empleados = fullData; // Asignación a la nueva variable 'empleados'
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rowsPerPage = event.rows;
    }

    getDynamicColumnLabel(): string {
        return this.selectedPeriodoPago === 'UTILIDADES' ? 'Días Utilidad' : 'Días Gratificación';
    }

    // RENOMBRADO: De trabajador a empleado en el parámetro
    openInasistenciaDialog(empleado: AsistenciaView) { 
        this.selectedInasistenciaEmpleado = empleado; // Asignación a la nueva variable
        this.displayInasistenciaDialog = true;
    }

    // --- FUNCIONES DE ACCIÓN CRUD/UTILIDAD ---

    guardar() {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea guardar los cambios de asistencia?',
            header: 'Confirmar Guardado',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                verMensajeInformativo(
                    this.messageService, 
                    'success', 
                    'Éxito', 
                    // Referencia a 'empleados'
                    `Se guardaron los datos de ${this.empleados.length} empleados correctamente` 
                );
            }
        });
    }

    eliminarEmpleado() {
        // Referencia a 'selectedEmpleado'
        if (!this.selectedEmpleado) { 
            verMensajeInformativo(
                this.messageService, 
                'error', 
                'Error', 
                'Debe seleccionar un empleado de la lista.'
            );
            return;
        }

        this.confirmationService.confirm({
            // Referencia a 'selectedEmpleado'
            message: `¿Está seguro que desea eliminar a ${this.selectedEmpleado.apellidosynombres} del listado de asistencia?`, 
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                // Filtro usando 'empleados' y 'selectedEmpleado'
                this.empleados = this.empleados.filter(e => e.pla01empleadocod !== this.selectedEmpleado?.pla01empleadocod); 
                this.totalRecords = this.empleados.length;
                this.selectedEmpleado = null;
                
                verMensajeInformativo(
                    this.messageService, 
                    'success', 
                    'Éxito', 
                    'Empleado eliminado del listado de asistencia.'
                );
            }
        });
    }

    cancelar() {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea cancelar? Se cerrará la vista.',
            header: 'Confirmar Cancelación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.loadEmpleados(); // Llamada a la función renombrada
                this.selectedEmpleado = null;
                this.isMenuOpen = false;
                
                verMensajeInformativo(
                    this.messageService, 
                    'info', 
                    'Cerrando', 
                    'Vista cerrada.'
                );
            }
        });
    }

    vistaPrevia() {
        verMensajeInformativo(
            this.messageService, 
            'info', 
            'Vista Previa', 
            'Generando vista previa del reporte de asistencia...'
        );
    }

    getFechaIngresoFormateada(fecha: Date): string {
        if (!esFechaValida(fecha)) return 'N/A';
        return formatearFecha(fecha);
    }

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