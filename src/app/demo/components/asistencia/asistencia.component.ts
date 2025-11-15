import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

// Agregamos CalendarModule, BadgeModule y las nuevas interfaces si aún no están
import { CalendarModule } from 'primeng/calendar';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber'; // Agregamos si lo usaremos para los días

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

// Importación de interfaces de modelo
import { Asistencia } from 'src/app/demo/model/Asistencia';
import { Inasistencia } from 'src/app/demo/model/Inasistencia'; // Importamos la nueva interfaz

export interface AsistenciaView extends Asistencia {
    idIdentidad: string;
}

interface PeriodoPago {
    label: string;
    value: string;
}

// Nueva interfaz para el Dropdown de Tipo de Suspensión
interface TipoSuspension {
    code: string;
    name: string;
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
        DialogModule,
        CalendarModule, // Añadido
        BadgeModule,    // Añadido
        InputNumberModule // Añadido
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './asistencia.component.html',
    styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

    empleados: AsistenciaView[] = []; 
    rowsPerPage: number = 10;
    selectedEmpleado: AsistenciaView | null = null; 

    totalRecords: number = 0;
    first: number = 0;
    isMenuOpen: boolean = true;

    // Variables del Diálogo de Inasistencia
    displayInasistenciaDialog: boolean = false;
    selectedInasistenciaEmpleado: AsistenciaView | null = null; 
    
    inasistencias: Inasistencia[] = []; 
    selectedInasistencia: Inasistencia | null = null; 
    isEditingInasistencia: boolean = false; 

    periodoPagoOptions: PeriodoPago[] = [
        { label: 'Planilla Utilidades - 20251', value: 'UTILIDADES' },
        { label: 'Planilla Gratificaciones ley - 20252', value: 'GRATIFICACIONES' }
    ];
    selectedPeriodoPago: string = 'UTILIDADES';

    tipoSuspensionOptions: TipoSuspension[] = [
        { code: '01', name: 'S.P. SANCIÓN DISCIPLINARIA' },
        { code: '02', name: 'S.P. EJERCICIO DEL DERECHO DE HUELGA' },
        { code: '03', name: 'S.P. DETENCIÓN DEL TRABAJADOR' },
        { code: '04', name: 'S.P. INHABILITACIÓN ADMINISTRATIVA O JUDICIAL' },
        { code: '05', name: 'S.P. PERMISO O LICENCIA CONCEDIDOS POR EL EMPLEADOR' },
        { code: '06', name: 'S.P. CASO FORTUITO O FUERZA MAYOR' },
        { code: '07', name: 'S.P. FALTA NO JUSTIFICADA' },
    ];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService 
    ) { }

    ngOnInit() {
        this.loadEmpleados(); 
    }

    loadEmpleados() {
        const fullData: AsistenciaView[] = [
            { pla01empleadocod: '000001', idIdentidad: '08680851', apellidosynombres: 'MARTINEZ GARCIA Joel alberto', pla01fechaingreso: new Date(2006, 7, 16), pla01estado: 'A', pla02utilidad: 180, pla02gratificacion: 150 },
            { pla01empleadocod: '000002', idIdentidad: '07271641', apellidosynombres: 'CALDERON PEREZ PYME', pla01fechaingreso: new Date(2006, 0, 1), pla01estado: 'A', pla02utilidad: 180, pla02gratificacion: 180 },
            { pla01empleadocod: '000003', idIdentidad: '10861418', apellidosynombres: 'SARMIENTO RENDON MYPE', pla01fechaingreso: new Date(2019, 0, 1), pla01estado: 'A', pla02utilidad: 100, pla02gratificacion: 100 },
            { pla01empleadocod: '000009', idIdentidad: '10890765', apellidosynombres: 'SNP SNP RegGeneralRP ', pla01fechaingreso: new Date(2020, 8, 1), pla01estado: 'A', pla02utilidad: 90, pla02gratificacion: 45 }
        ];

        this.totalRecords = fullData.length;
        this.empleados = fullData;
    }

    // --- Lógica de Inasistencias ---

    openInasistenciaDialog(empleado: AsistenciaView) { 
        this.selectedInasistenciaEmpleado = empleado;
        this.loadInasistencias(empleado.pla01empleadocod); // Cargar datos reales o simulados
        this.isEditingInasistencia = false;
        this.selectedInasistencia = null;
        this.displayInasistenciaDialog = true;
    }

    loadInasistencias(empleadoCod: string) {
        // SIMULACIÓN: Carga de inasistencias para el ejemplo
        if (empleadoCod === '000001') {
            this.inasistencias = [
                {
                    pla03tiposuspension: '07',
                    glo02descripcion: 'S.P. FALTA NO JUSTIFICADA',
                    pla03fechainicio: new Date(2025, 6, 15), 
                    pla03fechafin: new Date(2025, 6, 17),  
                    pla03diasnotrabajados: 3
                },
                {
                    pla03tiposuspension: '05',
                    glo02descripcion: 'S.P. PERMISO O LICENCIA CONCEDIDOS POR EL EMPLEADOR',
                    pla03fechainicio: new Date(2025, 9, 5), 
                    pla03fechafin: new Date(2025, 9, 5),  
                    pla03diasnotrabajados: 1
                }
            ];
        } else {
            this.inasistencias = [];
        }
    }

    addInasistencia() {

        const newInasistencia: Inasistencia = {
            pla03tiposuspension: '',
            glo02descripcion: 'Seleccione un tipo de suspensión',
            pla03fechainicio: new Date(),
            pla03fechafin: new Date(),
            pla03diasnotrabajados: 1
        };
        this.inasistencias.unshift(newInasistencia);
        this.selectedInasistencia = newInasistencia;
        this.isEditingInasistencia = true;
    }
    
    editInasistencia(inasistencia: Inasistencia) {
        this.selectedInasistencia = inasistencia;
        this.isEditingInasistencia = true;
    }

    saveInasistencia(inasistencia: Inasistencia) {
        if (!inasistencia.pla03tiposuspension) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe seleccionar un Tipo de Suspensión.');
            return;
        }
        // Lógica de guardado (API call aquí)
        this.isEditingInasistencia = false;
        this.selectedInasistencia = null;
        verMensajeInformativo(this.messageService, 'success', 'Guardado', 'Registro de inasistencia guardado correctamente.');
    }

    cancelEditInasistencia(inasistencia: Inasistencia, index: number) {
        this.isEditingInasistencia = false;
        this.selectedInasistencia = null;

        // Si es una fila nueva, la eliminamos de la lista
        if (!inasistencia.pla03tiposuspension) {
            this.inasistencias.splice(index, 1);
        } else {
            // Lógica para recargar/deshacer cambios si no es nueva (requiere guardar el estado original)
            this.loadInasistencias(this.selectedInasistenciaEmpleado!.pla01empleadocod); // Simulación de deshacer
        }
    }

    deleteInasistencia(inasistencia: Inasistencia) {

        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar la inasistencia por ${inasistencia.glo02descripcion}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.inasistencias = this.inasistencias.filter(i => i !== inasistencia);
                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Inasistencia eliminada.');
            }
        });
    }

    updateDays(inasistencia: Inasistencia) {
        if (inasistencia.pla03fechainicio && inasistencia.pla03fechafin) {
            const startDate = inasistencia.pla03fechainicio.getTime();
            const endDate = inasistencia.pla03fechafin.getTime();

            if (endDate >= startDate) {
                // Cálculo de días, incluyendo el día de inicio y fin (días naturales)
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                inasistencia.pla03diasnotrabajados = diffDays;
            } else {
                inasistencia.pla03diasnotrabajados = 0;
            }
        } else {
            inasistencia.pla03diasnotrabajados = 0;
        }
    }

    // El evento de cambio de Dropdown en el diálogo (Para actualizar la descripción)
    onTipoSuspensionChange(event: any, inasistencia: Inasistencia) {
        const selectedType = this.tipoSuspensionOptions.find(t => t.code === event.value);
        if (selectedType) {
            inasistencia.glo02descripcion = selectedType.name;
        }
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rowsPerPage = event.rows;
    }

    getDynamicColumnLabel(): string {
        return this.selectedPeriodoPago === 'UTILIDADES' ? 'Días Utilidad' : 'Días Gratificación';
    }

   
    guardar(empleado: AsistenciaView) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea guardar los cambios de asistencia?',
            header: 'Confirmar Guardado',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                // Tu lógica original de "Guardar Todo"
                verMensajeInformativo(this.messageService, 'success', 'Éxito', `Se guardaron los datos de ${this.empleados.length} empleados correctamente`);
            }
        });
    }


    eliminarEmpleado(empleado: AsistenciaView) {
        // Ya no se comprueba this.selectedEmpleado, se usa el empleado de la fila
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar a ${empleado.apellidosynombres} del listado de asistencia?`, 
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.empleados = this.empleados.filter(e => e.pla01empleadocod !== empleado.pla01empleadocod); 
                this.totalRecords = this.empleados.length;
                
                // Si el empleado eliminado era el que estaba seleccionado, lo deseleccionamos
                if (this.selectedEmpleado && this.selectedEmpleado.pla01empleadocod === empleado.pla01empleadocod) {
                    this.selectedEmpleado = null;
                }
                
                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Empleado eliminado del listado de asistencia.');
            }
        });
    }

    cancelar(empleado: AsistenciaView) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea cancelar? Se cerrará la vista.',
            header: 'Confirmar Cancelación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.loadEmpleados(); 
                this.selectedEmpleado = null;
                this.isMenuOpen = false;
                verMensajeInformativo(this.messageService, 'info', 'Cerrando', 'Vista cerrada.');
            }
        });
    }

    vistaPrevia(empleado: AsistenciaView) {
        verMensajeInformativo(this.messageService, 'info', 'Vista Previa', `Generando vista previa para: ${empleado.apellidosynombres}`);
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