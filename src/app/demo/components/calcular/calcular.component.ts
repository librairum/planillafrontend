import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de PrimeNG
import { TableModule, Table } from 'primeng/table';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { SplitterModule } from 'primeng/splitter';

import { MessageService, ConfirmationService } from 'primeng/api';
import { verMensajeInformativo, aMayusculas } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { Calcular, DetalleProceso, Ajuste, ConceptoAjustable, ImpIngDesc } from 'src/app/demo/model/Calcular';

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
        ConfirmDialogModule,
        FileUploadModule,
        SplitterModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './calcular.component.html',
    styleUrls: ['./calcular.component.css']
})
export class CalcularComponent implements OnInit {

    @ViewChild('ajustesTable') ajustesTable!: Table;

    @ViewChild('fileInput') fileInput!: ElementRef;

    // Datos principales
    procesar: Calcular[] = [
        { pla01empleadocod: '000001', pla01docuidentidadnro: '08980693', apellidosynombres: aMayusculas('Martinez Garcia Joel Alberto'), pla01fechaingreso: new Date('2005-09-18'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000002', pla01docuidentidadnro: '07271641', apellidosynombres: aMayusculas('Calderon Perez Jaime'), pla01fechaingreso: new Date('2008-01-01'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000007', pla01docuidentidadnro: '10207346', apellidosynombres: aMayusculas('Afrocmisionflujo Debajocultorer Es'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000013', pla01docuidentidadnro: '23456789', apellidosynombres: aMayusculas('Regeneralseguro Sutraiuo Sotrisa'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'CALCULADA' },
        { pla01empleadocod: '000014', pla01docuidentidadnro: '10234545', apellidosynombres: aMayusculas('Etacatinormal Sta'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000015', pla01docuidentidadnro: '43239670', apellidosynombres: aMayusculas('5Tacatextraordinaria 5Tatent'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
        { pla01empleadocod: '000016', pla01docuidentidadnro: '10234321', apellidosynombres: aMayusculas('Etacatinormal Certificado Dect'), pla01fechaingreso: new Date('2019-03-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    ];

    // Variables de Reportes
    boletaChecked: boolean = false;
    planillaGeneralChecked: boolean = false;
    liquidacionChecked: boolean = false;

    displayReporteDialog: boolean = false;
    tituloReporte: string = '';
    // Estructura de datos para el reporte de Boleta (basado en tu imagen)
    reporteBoletaData: any = {
        periodo: '',
        subtitulo: '',
        codigo: '',
        dni: '',
        nombres: '',
        fechaIngreso: null,
        tipoTrabajador: '',
        regimen: '',
        cupss: '',
        cargo: '',
        diasLaborados: '',
        diasNoLaborados: '',
        diasSubsidiados: '',
        horasOrdinarias: '',
        minutosOrdinarios: '',
        horasSobretiempo: '',
        minutosSobretiempo: '',
        datosAdicionales: [],
        ingresos: [],
        descuentos: [],
        aportesEmpleador: [],
        netoPagar: ''
    };

    rowsPerPage: number = 10;

    displayDetalleDialog: boolean = false;
    detalleProcesoData: DetalleProceso[] = [];
    selectedEmpleadoDetalle: Calcular | null = null;

    displayAjusteDialog: boolean = false;
    selectedEmpleadoAjuste: Calcular | null = null;
    ajustesData: Ajuste[] = [];

    clonedAjustes: { [key: string]: Ajuste } = {};
    ajusteEnEdicion: Ajuste | null = null;
    isEditing: boolean = false;
    ajusteDialogClosable: boolean = true;

    conceptosAjustables: ConceptoAjustable[] = [];
    private nextTempId: number = -1;

    // Variables de Importación
    displayImportDialog: boolean = false;
    datosImportados: ImpIngDesc[] = [];
    logsImportacion: ImpIngDesc[] = [];

    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.loadConceptosAjustables();
    }

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

    verDetalle(empleado: Calcular): void {
        this.selectedEmpleadoDetalle = empleado;
        this.detalleProcesoData = this.simularDetalle(empleado.pla01empleadocod);
        this.displayDetalleDialog = true;
        verMensajeInformativo(this.messageService, 'info', 'Detalle', `Cargando vista de detalle para: ${empleado.apellidosynombres}`);
    }

    // --- Lógica de Ajustes ---
    simularAjustes(empleadoCod: string): Ajuste[] {
        let ajustes: Ajuste[] = [];
        if (empleadoCod === '000013') {
            ajustes = [
                { id: 1, pla10conceptocod: '0501', pla10conceptodesc: '', importe: 2.00 },
                { id: 2, pla10conceptocod: '0901', pla10conceptodesc: '', importe: 150.00 },
            ];
        }
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
        this.nextTempId = -1;
        this.displayAjusteDialog = true;
        this.isEditing = false;
        this.ajusteDialogClosable = true;
        verMensajeInformativo(this.messageService, 'warn', 'Ajuste', `Abriendo ajustes para: ${empleado.apellidosynombres}`);
    }

    onAjusteDialogHide(): void {
        if (this.isEditing) {
            this.displayAjusteDialog = true;
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe guardar o cancelar la edición actual antes de cerrar la ventana de ajustes.');
        } else {
            this.displayAjusteDialog = false;
        }
    }

    addNewRow(): void {
        const newAjuste: Ajuste = {
            id: this.nextTempId--,
            pla10conceptocod: null,
            pla10conceptodesc: 'Seleccione Concepto',
            importe: 0.00
        };
        this.ajustesData = [...this.ajustesData, newAjuste];
        this.ajusteEnEdicion = newAjuste;
        this.clonedAjustes[newAjuste.id] = { ...newAjuste };

        setTimeout(() => {
            if (this.ajustesTable) {
                this.ajustesTable.initRowEdit(newAjuste);
                this.isEditing = true;
                this.ajusteDialogClosable = false;
            }
        }, 0);
    }

    deleteRow(ajuste: Ajuste, index: number): void {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'No se puede eliminar mientras editas otra fila.');
            return;
        }
        const conceptodsc = ajuste.pla10conceptodesc === 'Seleccione Concepto' ? 'PENDIENTE' : ajuste.pla10conceptodesc;

        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el ajuste para el concepto: ${conceptodsc}?`,
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.ajustesData.splice(index, 1);
                this.ajustesData = [...this.ajustesData];
                if (this.clonedAjustes[ajuste.id]) { delete this.clonedAjustes[ajuste.id]; }
                verMensajeInformativo(this.messageService, 'success', 'Eliminado', 'Ajuste eliminado correctamente.');
            },
        });
    }

    onRowEditInit(ajuste: Ajuste) {
        if (this.isEditing) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Ya hay una fila en edición, guarde o cancele primero.');
            return;
        }
        this.clonedAjustes[ajuste.id] = { ...ajuste };
        this.ajusteEnEdicion = ajuste;
        this.isEditing = true;
        this.ajusteDialogClosable = false;
        verMensajeInformativo(this.messageService, 'info', 'Edición', `Editando concepto: ${ajuste.pla10conceptodesc}`);
    }

    onRowEditSave(ajuste: Ajuste, index: number) {
        if (!ajuste.pla10conceptocod) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe seleccionar un Código Concepto para guardar el registro.');
            return;
        }
        if (ajuste.importe === null || typeof ajuste.importe !== 'number' || isNaN(ajuste.importe)) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Debe ingresar un importe válido.');
            return;
        }
        delete this.clonedAjustes[ajuste.id];
        this.ajusteEnEdicion = null;
        this.isEditing = false;
        this.ajusteDialogClosable = true;
        this.onConceptoSelect(ajuste, ajuste.pla10conceptocod);
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Ajuste guardado correctamente.');
    }

    onRowEditCancel(ajuste: Ajuste, index: number) {
        if (this.clonedAjustes[ajuste.id]) {
            this.ajustesData[index] = this.clonedAjustes[ajuste.id];
            delete this.clonedAjustes[ajuste.id];
        }
        this.ajusteEnEdicion = null;
        this.isEditing = false;
        this.ajusteDialogClosable = true;
    }

    // --- GESTIÓN DE REPORTES E IMPRESIÓN  ---

    procesarDatos(): void { verMensajeInformativo(this.messageService, 'success', 'Procesando', 'Iniciando procesamiento de datos...'); }

    toggleBoleta(): void { if (this.boletaChecked) { this.planillaGeneralChecked = false; this.liquidacionChecked = false; } }
    togglePlanillaGeneral(): void { if (this.planillaGeneralChecked) { this.boletaChecked = false; this.liquidacionChecked = false; } }
    toggleLiquidacion(): void { if (this.liquidacionChecked) { this.boletaChecked = false; this.planillaGeneralChecked = false; } }

    imprimir(): void {
        // Validar selección
        if (!this.boletaChecked && !this.planillaGeneralChecked && !this.liquidacionChecked) {
            verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Debe seleccionar un tipo de reporte.');
            return;
        }

        if (this.boletaChecked) {
            this.verBoleta();
        }/*else if (this.planillaGeneralChecked) {
            this.verPlanillaGeneral();}
            else if (this.liquidacionChecked){
                this.verLiquidacion();}
            }*/
        else {
            // Placeholder para liquidación
            verMensajeInformativo(this.messageService, 'info', 'Información', 'Generando reporte...');
        }
    }

    verBoleta(): void {
        verMensajeInformativo(this.messageService, 'info', 'Generando', 'Generando reporte de Boleta...');

        const empleado = this.procesar.length > 0 ? this.procesar[0] : null;

        if (empleado) {
            this.tituloReporte = 'BOLETA DE PAGO';

            this.reporteBoletaData = {
                periodo: '2025 - 11',
                subtitulo: 'Planilla Gratificaciones ley -',
                codigo: empleado.pla01empleadocod,
                dni: empleado.pla01docuidentidadnro,
                nombres: empleado.apellidosynombres,
                fechaIngreso: empleado.pla01fechaingreso,
                tipoTrabajador: '', // Vacío por defecto
                regimen: '',
                cupss: '',
                cargo: empleado.pla51descripcion,

                // Cuerpos vacíos para ser llenados en el HTML
                diasLaborados: '',
                diasNoLaborados: '',
                diasSubsidiados: '',
                horasOrdinarias: '',
                minutosOrdinarios: '',
                horasSobretiempo: '',
                minutosSobretiempo: '',

                datosAdicionales: [{}, {}, {}], // Filas vacías para la grilla derecha
                ingresos: [],
                descuentos: [],
                aportesEmpleador: [],
                netoPagar: ''
            };

            // Abrir el diálogo del reporte
            this.displayReporteDialog = true;
        } else {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'No hay datos para generar la boleta.');
        }
    }

    /*verPlanillaGeneral(): void {
        verMensajeInformativo(this.messageService, 'info', 'Generando', 'Generando reporte de Planilla General...');
        this.tituloReporte = 'PLANILLA GENERAL';
        // Lógica similar para planilla...
        this.displayReporteDialog = true;
    }*/

    // --- LÓGICA PARA IMPORTACIÓN ---

    importarArchivos(): void {
        this.displayImportDialog = true;
        this.datosImportados = [];
        this.logsImportacion = [];
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    cerrarImportacion(): void {
        this.displayImportDialog = false;
        this.datosImportados = [];
        this.logsImportacion = [];
    }

    activarSeleccionArchivo(): void {
        this.fileInput.nativeElement.click();
    }

    cargarArchivoTxt(event: any): void {
        const archivo = event.target.files[0];
        if (!archivo) return;

        if (!archivo.name.toLowerCase().endsWith('.txt')) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Solo se permiten archivos de texto (.txt)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const contenido = e.target.result;
            this.procesarContenidoTxt(contenido);
        };
        reader.onerror = (e) => {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Ocurrió un error al leer el archivo.');
        };
        reader.readAsText(archivo);
    }

    procesarContenidoTxt(contenido: string): void {
        this.datosImportados = [];
        this.logsImportacion = [];

        const lineas = contenido.split(/\r\n|\n/);
        let numeroLinea=0;
        
        lineas.forEach(linea => {
            if (!linea.trim()) return;
            const datos = linea.split('|');

            if (datos.length >= 3) {
                const codEmpleado = datos[0];
                const codConcepto = datos[1];
                const importeStr = datos[2];

                const nuevoRegistro: ImpIngDesc = {
                    pla01empleadocod: codEmpleado,
                    apellidosynombres: '---',
                    pla10conceptocod: codConcepto,
                    pla10conceptodesc: this.buscarNombreConcepto(codConcepto),
                    importe: parseFloat(importeStr) || 0,
                    orden: numeroLinea + 1,
                    fila: numeroLinea + 1,
                    mensaje: null
                };
                this.datosImportados.push(nuevoRegistro);
                numeroLinea++;
            }
        });

        if (this.datosImportados.length > 0) {
            verMensajeInformativo(this.messageService, 'success', 'Éxito', `Se leyeron ${this.datosImportados.length} registros correctamente.`);
        } else {
            verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'El archivo no contenía registros válidos o tenía un formato incorrecto (se espera: CodEmp|CodConc|Importe).');
        }
    }

    buscarNombreConcepto(codigo: string): string {
        const concepto = this.conceptosAjustables.find(c => c.code === codigo);
        return concepto ? concepto.name : 'NO DEFINIDO';
    }

    guardarImportacion(): void {
        if (this.datosImportados.length === 0) {
            verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'No tiene registros importados.');
            return;
        }
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registros importados y procesados correctamente.');
        this.cerrarImportacion();
    }

    simularCargaArchivo(): void {
        this.activarSeleccionArchivo();
    }
}