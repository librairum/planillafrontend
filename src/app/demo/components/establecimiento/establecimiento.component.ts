import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { Establecimiento } from 'src/app/demo/model/Empresa';
import {
    verMensajeInformativo,
    esVacio,
    aMayusculas
} from 'src/app/demo/components/utilities/funciones_utilitarias';

@Component({
    selector: 'app-establecimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        CheckboxModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        PanelModule,
        DropdownModule,
        RippleModule,
        TableModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './establecimiento.component.html',
    styleUrls: ['./establecimiento.component.css']
})

export class EstablecimientoComponent implements OnInit {

    establecimiento: Establecimiento = this.initializeEstablecimiento();
    currentEstablecimientoCodigo: string = '';

    // Lista de establecimientos para la tabla
    establecimientos: Establecimiento[] = [];
    rowsPerPage: number = 10;

    // Modos de edición
    isAddMode: boolean = false;
    isEditMode: boolean = false;

    editingEstablecimiento: Establecimiento | null = null;

    // Opciones para combobox - tipo establecimiento
    tipoOptions = [
        { label: 'DOMICILIO FISCAL', value: '00' },
        { label: 'CASA MATRIZ', value: '01' },
        { label: 'SUCURSAL', value: '02' },
        { label: 'AGENCIA', value: '03' },
        { label: 'LOCAL COMERCIAL O DE SERVICIOS', value: '04' },
        { label: 'SEDE PRODUCTIVA', value: '05' },
        { label: 'DEPÓSITO (ALMACÉN)', value: '06' },
    ];

    currentEstablecimientos: Establecimiento[] = [
        {
            pla20codigo: '0000',
            pla20denominacion: 'OFICINA PRINCIPAL - LIMA',
            pla20establecimientotipo: '00',
            pla20sctrflag: false,
            pla20sctrtasa: null as any,
        },
        {
            pla20codigo: '0001',
            pla20denominacion: 'ALMACÉN CALLAO',
            pla20establecimientotipo: '06',
            pla20sctrflag: true,
            pla20sctrtasa: 15.5,
        },
    ];

    selectedEstablecimiento: Establecimiento | null = null;

    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        // Carga inicial de datos simulados
        this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));
    }

    private initializeEstablecimiento(): Establecimiento {
        return {
            pla20codigo: '',
            pla20denominacion: '',
            pla20sctrflag: false,
            pla20establecimientotipo: '',
            pla20sctrtasa: null as any,
        };
    }

    // --- Métodos de Control de UI ---

    agregarEstablecimiento(): void {

        // Creamos un nuevo establecimiento
        const newEstablecimiento: Establecimiento = {
            ...this.initializeEstablecimiento(),
            //Generamos un código basado en la fecha
            pla20codigo: `${Date.now()}`
        };

        // push permite agregar el nuevo establecimiento al final de la lista
        this.establecimientos.push(newEstablecimiento);

        this.editingEstablecimiento = JSON.parse(JSON.stringify(newEstablecimiento));

        // 4. Establecer el modo adición
        this.isAddMode = true;
        this.isEditMode = false;

        this.establecimiento = this.initializeEstablecimiento();
        this.selectedEstablecimiento = null;
    }

    cancelar(): void {
        // Cancela el modo de Adición 
        this.isAddMode = false;
        this.isEditMode = false;

        this.establecimiento = this.initializeEstablecimiento();
        this.selectedEstablecimiento = null;
    }


    onRowEditarEstablecimiento(establecimiento: Establecimiento): void {
        // Clonamos profundamente el objeto para evitar modificar la tabla directamente
        this.editingEstablecimiento = JSON.parse(JSON.stringify(establecimiento));
        this.isEditMode = true;
        this.isAddMode = false;
    }

    onRowCancelarEdicion(establecimiento: Establecimiento): void {
        if (this.isAddMode) {
            this.establecimientos = this.establecimientos.filter(e => e.pla20codigo !== establecimiento.pla20codigo);
        }

        this.editingEstablecimiento = null;
        this.isEditMode = false;
        this.isAddMode = false;

        this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));
    }

    onRowValidarCampos(establecimiento: Establecimiento): boolean {

        if (this.isAddMode) {
            if (esVacio(establecimiento.pla20codigo)) {
                verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código es obligatorio para el nuevo registro.');
                return false;
            }

            if (this.currentEstablecimientos.some(e => e.pla20codigo.toUpperCase() === establecimiento.pla20codigo.toUpperCase())) {
                verMensajeInformativo(this.messageService, 'error', 'Error', `El Código ${establecimiento.pla20codigo} ya existe.`);
                return false;
            }
        }

        if (esVacio(establecimiento.pla20denominacion)) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'La Denominación es obligatoria.');
            return false;
        }

        if (esVacio(establecimiento.pla20establecimientotipo)) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'El Tipo de Establecimiento es obligatorio.');
            return false;
        }

        // Validación SCRT y Tasa
        if (establecimiento.pla20sctrflag) {
            if (establecimiento.pla20sctrtasa === null || establecimiento.pla20sctrtasa === undefined || establecimiento.pla20sctrtasa <= 0) {
                verMensajeInformativo(this.messageService, 'error', 'Error', 'La tasa debe ser un valor positivo');
                return false;
            }
        }

        return true;
    }

    onRowGuardarEdicion(original: Establecimiento): void {
        const edited = this.editingEstablecimiento;
        if (!edited) return;

        if (!this.onRowValidarCampos(edited)) {
            return;
        }

        // Estandarización y consistencia
        edited.pla20denominacion = aMayusculas(edited.pla20denominacion);
        edited.pla20codigo = edited.pla20codigo.toUpperCase();

        // Si SCRT no está marcado, la tasa debe ser null
        if (!edited.pla20sctrflag) {
            edited.pla20sctrtasa = null as any;
        }

        let mensajeExito = '';

        if (this.isAddMode) {
            this.establecimientos = this.establecimientos.filter(e => e.pla20codigo !== original.pla20codigo);

            // 2. Agregar el nuevo establecimiento guardado al array principal de datos
            this.currentEstablecimientos.push(JSON.parse(JSON.stringify(edited)));
            mensajeExito = 'Establecimiento agregado exitosamente';

        } else {

            const index = this.currentEstablecimientos.findIndex(e => e.pla20codigo === original.pla20codigo);

            if (index > -1) {
                this.currentEstablecimientos[index] = JSON.parse(JSON.stringify(edited));
                mensajeExito = 'Cambios guardados exitosamente';
            } else {
                //verMensajeInformativo(this.messageService, 'error', 'Error', 'No se encontró el registro original para actualizar.');

                this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));
                this.onRowCancelarEdicion(original);
                return;
            }
        }

        this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));

        verMensajeInformativo(this.messageService, 'success', 'Éxito', mensajeExito);

        this.editingEstablecimiento = null;
        this.isEditMode = false;
        this.isAddMode = false;
    }

    eliminarEstablecimiento(establecimiento: Establecimiento): void {

        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el establecimiento ${establecimiento.pla20codigo}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',

            accept: () => {
                const codigoAeliminar = establecimiento.pla20codigo;
                const initialLength = this.currentEstablecimientos.length;

                this.currentEstablecimientos = this.currentEstablecimientos.filter(e => e.pla20codigo !== codigoAeliminar);

                if (this.currentEstablecimientos.length < initialLength) {
                    this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));
                    verMensajeInformativo(this.messageService, 'success', 'Éxito', `Establecimiento ${codigoAeliminar} eliminado.`);
                } else {
                    verMensajeInformativo(this.messageService, 'error', 'Error', `No se encontró el establecimiento ${codigoAeliminar} para eliminar.`);
                }
            }
        });
    }

    getEstablecimientoTipoLabel(value: string): string {
        return this.tipoOptions.find(option => option.value === value)?.label || '';
    }
}
