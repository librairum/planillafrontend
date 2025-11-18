import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';

import { MessageService, ConfirmationService } from 'primeng/api'; // Añadido ConfirmationService si lo fueras a usar
import { Table } from 'primeng/table';

import { verMensajeInformativo, aMayusculas } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { Calcular } from '../../model/Calcular';
import { DetalleProceso } from 'src/app/demo/model/Calcular'

// --- INTERFACES ADICIONALES ---

interface ConceptoAjustable {
    code: string;
    name: string;
}

interface Ajuste {
    // Se añade un ID temporal para diferenciar las filas nuevas
    id: number;
    pla10conceptocod: string | null;
    pla10conceptodesc: string; // Nombre completo del concepto
    importe: number | null;
}

@Component({
    selector: 'app-calcular',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,

        TableModule,
        TagModule,
        ButtonModule,
        CheckboxModule,
        InputNumberModule,
        RippleModule,
        TooltipModule,
        ToolbarModule,
        ToastModule,
        CardModule,
        DropdownModule,
        DialogModule,
        InputTextModule,
        RadioButtonModule,
        PanelModule,
    ],
    // Mantenemos MessageService, no añadimos ConfirmationService si no está en el HTML
    providers: [MessageService], 
    templateUrl: './calcular.component.html',
    styleUrls: ['./calcular.component.css']
})
export class CalcularComponent implements OnInit {

    // --- Referencia a la tabla de Ajustes en el HTML ---
    @ViewChild('ajustesTable') ajustesTable!: Table;

    // --- Variables de Datos y Estado de la Tabla Principal ---
    procesar: Calcular[] = [
        { pla01empleadocod: '000001', pla01docuidentidadnro: '08980693', apellidosynombres: aMayusculas('Martinez Garcia Joel Alberto'), pla01fechaingreso: new Date('2005-09-18'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000002', pla01docuidentidadnro: '07271641', apellidosynombres: aMayusculas('Calderon Perez Jaime'), pla01fechaingreso: new Date('2008-01-01'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000007', pla01docuidentidadnro: '10207346', apellidosynombres: aMayusculas('Afrocmisionflujo Debajocultorer Es'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000013', pla01docuidentidadnro: '23456789', apellidosynombres: aMayusculas('Regeneralseguro Sutraiuo Sotrisa'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'CALCULADA' },
        { pla01empleadocod: '000014', pla01docuidentidadnro: '10234545', apellidosynombres: aMayusculas('Etacatinormal Sta'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000015', pla01docuidentidadnro: '43239670', apellidosynombres: aMayusculas('5Tacatextraordinaria 5Tatent'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000016', pla01docuidentidadnro: '10234321', apellidosynombres: aMayusculas('Etacatinormal Certificado Dect'), pla01fechaingreso: new Date('2019-03-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    ];

    // Estado de los checkboxes superiores
    boletaChecked: boolean = false;
    planillaGeneralChecked: boolean = false;
    liquidacionChecked: boolean = false;

    rowsPerPage: number = 10;

    displayDetalleDialog: boolean = false;
    detalleProcesoData: DetalleProceso[] = [];
    selectedEmpleadoDetalle: Calcular | null = null;

    // --- Variables de Datos y Estado del Diálogo de Ajustes ---
    displayAjusteDialog: boolean = false;
    selectedEmpleadoAjuste: Calcular | null = null;
    ajustesData: Ajuste[] = []; // Datos mostrados en la tabla de ajustes

    // Se mantiene, aunque el manejo de la edición ahora es más centralizado
    clonedAjustes: { [key: string]: Ajuste } = {}; 
    
    // Almacena el ajuste que se está editando para manejar la cancelación
    ajusteEnEdicion: Ajuste | null = null; 

    isEditing: boolean = false;
    ajusteDialogClosable: boolean = true; 

    conceptosAjustables: ConceptoAjustable[] = [];

    // Contador para IDs temporales de nuevas filas
    private nextTempId: number = -1;


    constructor(private messageService: MessageService) { }

    ngOnInit(): void {
        this.loadConceptosAjustables();
    }

    // Carga de conceptos disponibles para el Dropdown
    loadConceptosAjustables() {
        this.conceptosAjustables = [
            { code: '0501', name: 'Días Trabajados' },
            { code: '0506', name: 'Horas Trabajadas' },
            { code: '0511', name: 'Días Descanso Médico' },
            { code: '0526', name: 'Dias Vacaciones Físicas' },
            { code: '0516', name: 'Días Subsidio' },
            { code: '0521', name: 'Días Compensacion' },
            { code: '0524', name: 'Minutos de Tardanza' },
            { code: '0901', name: 'Bonificación por desempeño' },
        ];
    }

    public onConceptoSelect(ajuste: Ajuste, selectedCode: string | null): void {
        if (selectedCode) {
            const concepto = this.conceptosAjustables.find(c => c.code === selectedCode);
            if (concepto) {
                ajuste.pla10conceptodesc = concepto.name;
            }
        } else {
            // Si se limpia la selección
            ajuste.pla10conceptodesc = 'Seleccione Concepto';
        }
    }


    getCalculoSeverity(estado: string): 'success' | 'danger' | 'warning' {
        switch (estado) {
            case 'CALCULADA': return 'success';
            case 'SIN CALCULAR': return 'danger';
            default: return 'warning';
        }
    }

    // --- Lógica del Detalle ---
    simularDetalle(empleadoCod: string): DetalleProceso[] {
        if (empleadoCod === '000001') {
            return [
                { pla10conceptocod: '0001', pla10conceptodesc: 'Sueldo Mensual Basico', importe: 3000.00, boleta: 'NO' },
                { pla10conceptocod: '0069', pla10conceptodesc: 'AFECTO A SCTR', importe: 1.00, boleta: 'NO' },
                { pla10conceptocod: '0526', pla10conceptodesc: 'Dias Vacaciones Físicas', importe: 0.00, boleta: 'NO' },
                { pla10conceptocod: '3309', pla10conceptodesc: 'SUELDO BASE 5TA CATEGORIA', importe: 3000.00, boleta: 'NO' },
                { pla10conceptocod: '3311', pla10conceptodesc: 'INGRESOS PROYECTADOS 5TA CAT', importe: 6270.00, boleta: 'NO' },
            ];
        }
        if (empleadoCod === '000013') {
            return [
                { pla10conceptocod: '0001', pla10conceptodesc: 'Sueldo', importe: 3500.00, boleta: 'SI' },
                { pla10conceptocod: '0010', pla10conceptodesc: 'Asignación Familiar', importe: 102.50, boleta: 'SI' },
                { pla10conceptocod: '9001', pla10conceptodesc: 'Descuento AFP', importe: -500.00, boleta: 'SI' },
            ];
        }
        return [];
    }

    // --- MÉTODOS DE ACCIÓN PRINCIPALES ---

    verDetalle(empleado: Calcular): void {
        this.selectedEmpleadoDetalle = empleado;
        this.detalleProcesoData = this.simularDetalle(empleado.pla01empleadocod);
        this.displayDetalleDialog = true;

        verMensajeInformativo(this.messageService, 'info', 'Detalle', `Cargando vista de detalle para: ${empleado.apellidosynombres}`);
    }


    simularAjustes(empleadoCod: string): Ajuste[] {
        let ajustes: Ajuste[] = [];

        // Simulamos algunos ajustes con IDs temporales para las pruebas
        if (empleadoCod === '000013') {
            ajustes = [
                { id: 1, pla10conceptocod: '0501', pla10conceptodesc: '', importe: 2.00 },
                { id: 2, pla10conceptocod: '0901', pla10conceptodesc: '', importe: 150.00 },
            ];
        }
        
        // Asigna la descripción real a cada ajuste al cargarlos
        return ajustes.map(ajuste => {
            const concepto = this.conceptosAjustables.find(c => c.code === ajuste.pla10conceptocod);
            ajuste.pla10conceptodesc = concepto ? concepto.name : 'Concepto No Encontrado';
            return ajuste;
        });
    }

    ajustar(empleado: Calcular): void {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'warn', 'Atención', 'Termine la edición actual antes de abrir otro ajuste.');
            return;
        }
        this.selectedEmpleadoAjuste = empleado;
        this.ajustesData = this.simularAjustes(empleado.pla01empleadocod);
        this.nextTempId = -1; // Resetear el contador de ID temporal
        this.displayAjusteDialog = true;
        this.isEditing = false;
        this.ajusteDialogClosable = true; // Aseguramos que se puede cerrar al abrir
        verMensajeInformativo(this.messageService, 'warn', 'Ajuste', `Abriendo ajustes para: ${empleado.apellidosynombres}`);
    }

    onAjusteDialogHide(): void {
        if (this.isEditing) {
            // Si está editando, re-abre el diálogo y muestra una advertencia
            this.displayAjusteDialog = true;
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe guardar o cancelar la edición actual antes de cerrar la ventana de ajustes.');
        } else {
            // Si no está editando, permite el cierre
            this.displayAjusteDialog = false;
        }
    }


    addNewRow(): void {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe guardar o cancelar la fila actual antes de añadir una nueva.');
            return;
        }

        const newAjuste: Ajuste = {
            id: this.nextTempId--, // ID temporal negativo
            pla10conceptocod: null,
            pla10conceptodesc: 'Seleccione Concepto',
            importe: 0.00
        };

        this.ajustesData = [...this.ajustesData, newAjuste];
        this.ajusteEnEdicion = newAjuste; // Marcamos el ajuste que se está editando

        // Retraso ligero para permitir que Angular renderice la fila
        setTimeout(() => {
            if (this.ajustesTable) {
                // Iniciar la edición en la nueva fila
                this.ajustesTable.initRowEdit(newAjuste);
                this.isEditing = true;
                this.ajusteDialogClosable = false;
            }
        }, 0);
    }


    // --- Confirmación de Eliminación ---
    deleteRow(ajuste: Ajuste, index: number): void {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'No se puede eliminar mientras editas otra fila.');
            return;
        }

        // Usamos la función nativa confirm para simplificar la implementación
        const confirmMsg = `¿Está seguro de eliminar el ajuste para el concepto con código: ${ajuste.pla10conceptocod || 'PENDIENTE'}?`;

        if (confirm(confirmMsg)) {
            this.ajustesData.splice(index, 1);
            this.ajustesData = [...this.ajustesData]; // Refrescar el arreglo
            verMensajeInformativo(this.messageService, 'success', 'Eliminado', 'Ajuste eliminado correctamente.');
        }
    }


    onRowEditInit(ajuste: Ajuste) {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Ya hay una fila en edición, guarde o cancele primero.');
            return;
        }
        
        // Clonar la fila para poder revertir cambios
        this.clonedAjustes[ajuste.id] = { ...ajuste };
        this.ajusteEnEdicion = ajuste;
        this.isEditing = true;
        this.ajusteDialogClosable = false;
        verMensajeInformativo(this.messageService, 'info', 'Edición', `Editando concepto: ${ajuste.pla10conceptocod || 'nueva fila'}`);
    }


   onRowEditSave(ajuste: Ajuste, index: number) {
        
        // 1. VALIDACIÓN OBLIGATORIA: El código de concepto DEBE estar seleccionado (no nulo).
        if (!ajuste.pla10conceptocod) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código Concepto es obligatorio. No se puede guardar vacío.');
            
            // ¡IMPORTANTE! Simplemente hacemos 'return'. 
            // Esto detiene el guardado, pero PrimeNG mantendrá la fila en modo de edición 
            // hasta que el usuario corrija o presione Cancelar.
            return; 
        }

        // 2. Validación Combinada: Importe (debe ser válido y distinto de cero)
        if (ajuste.importe === null || typeof ajuste.importe !== 'number' || isNaN(ajuste.importe) || ajuste.importe < 0) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe ingresar un importe válido');
            return;
        }
        
        // 3. Guardado Exitoso (Solo si pasó todas las validaciones)
        delete this.clonedAjustes[ajuste.id];
        this.ajusteEnEdicion = null;
        this.isEditing = false; // Permite editar otras filas/cerrar el diálogo
        this.ajusteDialogClosable = true;
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Ajuste guardado correctamente.');
    }

    onRowEditCancel(ajuste: Ajuste, index: number) {
        
        // Si el ajuste tiene un ID temporal (negativo), es una fila nueva, la eliminamos.
        if (ajuste.id < 0) {
            this.ajustesData.splice(index, 1);
            this.ajustesData = [...this.ajustesData]; // Refrescar el arreglo
        } 
        // Si no es una fila nueva, restauramos el valor clonado (solo si existe)
        else if (this.clonedAjustes[ajuste.id]) {
            this.ajustesData[index] = this.clonedAjustes[ajuste.id];
            delete this.clonedAjustes[ajuste.id];
        }

        this.ajusteEnEdicion = null;
        this.isEditing = false;
        this.ajusteDialogClosable = true; 
    }

    // --- MÉTODOS DE ACCIÓN RESTANTES ---

    procesarDatos(): void { verMensajeInformativo(this.messageService, 'success', 'Procesando', 'Iniciando procesamiento de datos...'); }
    importarArchivos(): void { verMensajeInformativo(this.messageService, 'info', 'Importar', 'Abriendo diálogo para importar archivos...'); }
    imprimir(): void { verMensajeInformativo(this.messageService, 'info', 'Imprimir', 'Generando reporte de impresión...'); }

    //Metodo para alternar la selección de boleta
    toggleBoleta(): void {
        if (this.boletaChecked) {
            this.planillaGeneralChecked = false; 
            this.liquidacionChecked = false;
        }
    }

    //Metodo para alternar la selección de planilla general
    togglePlanillaGeneral(): void {
        if (this.planillaGeneralChecked) {
            this.boletaChecked = false;
            this.liquidacionChecked = false;
        }
    }

    //Metodo para alternar la selección de liquidacion
    toggleLiquidacion(): void {
        if (this.liquidacionChecked) {
            this.boletaChecked = false; //false para deseleccionar boleta
            this.planillaGeneralChecked = false; //false para deseleccionar planilla general    
        }
    }
}