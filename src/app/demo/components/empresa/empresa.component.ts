import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';


import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Empresa, RepresentanteLegal, ResponsablePlanilla, Banco } from 'src/app/demo/model/Empresa';

import {
    verMensajeInformativo,
    esVacio,
    validarRUC,
    validarDNI,
    aMayusculas
} from 'src/app/demo/components/utilities/funciones_utilitarias';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
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
        ProgressSpinnerModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.css']
})

export class EmpresaComponent implements OnInit {

    @ViewChild('dt') dt: Table | undefined;

    empresa: Empresa = this.initForm();

    loading: boolean = false; 

    empresas: Empresa[] = [];
    rowsPerPage: number = 10;

    isViewMode: boolean = true;
    isAddMode: boolean = false;
    isEditMode: boolean = false;

    // Opciones para combobox
    docTipos = [
        { label: 'DOC. NACIONAL DE IDENTIDAD', value: '01' },
        { label: 'CARNÉ DE EXTRANJERÍA', value: '02' },
        { label: 'PASAPORTE', value: '03' },
    ];
    bancosOptions = [
        { label: 'BANCO CENTRAL DE RESERVA', value: '01' },
        { label: 'BANCO DE CREDITO BCP', value: '02' },
        { label: 'BANCO CONTINENTAL', value: '03' },
        { label: 'BANCO BANBIF', value: '04' },
        { label: 'BANCO INTERBANK', value: '08' }
    ];

    currentEmpresas: Empresa[] = [
        {
            empresacod: '00004',
            ruc: '20602193676',
            razonsocial: 'GM INGENIEROS Y CONSULTORES SAC',
            direccion: 'Av. Aviación 170 San Miguel, Lima',
            representanteLegal: {
                replegaldoctip: '02',
                replegaldocnro: '10808128',
                replegalapepaterno: 'REPRESENTANTE',
                replegalapematerno: 'LEGAL',
                replegalnombres: 'MASTERPLA'
            },
            responsablePlanilla: {
                encargadoplanilladoctip: '01',
                encargadoplanilladocnro: '10808128',
                encargadoplanillaapepaterno: 'RESPONSABLE',
                encargadoplanillaapematerno: 'PLANILLA',
                encargadoplanillanombres: 'MASTERPLA'
            },
            bancos: {
                ctasolespagobancocod: '08',
                ctasolespagonumero: 'CUENTASOLESINTERBANK',
                ctadolarespagobancocod: '08',
                ctadolarespagonumero: 'CUENTADOLARESINTERBANK'
            }
        },
        {
            empresacod: '00005',
            ruc: '20602199999',
            razonsocial: 'EMPRESA ALICORP S.A.C.',
            direccion: 'CALLE PRINCIPAL 123',
            representanteLegal: {
                replegaldoctip: '01',
                replegaldocnro: '98765432',
                replegalapepaterno: 'PEREZ',
                replegalapematerno: 'GOMEZ',
                replegalnombres: 'JUAN'
            },
            responsablePlanilla: {
                encargadoplanilladoctip: '01',
                encargadoplanilladocnro: '12345678',
                encargadoplanillaapepaterno: 'LOPEZ',
                encargadoplanillaapematerno: 'DIAZ',
                encargadoplanillanombres: 'ANA'
            },
            bancos: {
                ctasolespagobancocod: '02',
                ctasolespagonumero: 'CUENTASOLESDELBCP',
                ctadolarespagobancocod: '03',
                ctadolarespagonumero: 'CUENTADOLARESDELCONTINENTAL'
            }
        }
    ];

    //permite seleccionar una empresa
    selectedEmpresa: Empresa | null = null;

    //constructor que inicializa los servicios
    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

    //metodo para inicializar
    ngOnInit(): void {
        // Carga inicial de datos simulados
        this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas));
    }

    private initForm(): Empresa {
        return {
            empresacod: '',
            ruc: '',
            razonsocial: '',
            direccion: '',
            representanteLegal: {
                replegaldoctip: '',
                replegaldocnro: '',
                replegalapepaterno: '',
                replegalapematerno: '',
                replegalnombres: ''
            },
            responsablePlanilla: {
                encargadoplanilladoctip: '',
                encargadoplanilladocnro: '',
                encargadoplanillaapepaterno: '',
                encargadoplanillaapematerno: '',
                encargadoplanillanombres: ''
            },
            bancos: {
                ctasolespagobancocod: '',
                ctasolespagonumero: '',
                ctadolarespagobancocod: '',
                ctadolarespagonumero: ''
            }
        };
    }

    

    isDisabled(): boolean {
        // Devuelve TRUE si está en modo de Vista o si no está en modo Agregar/Editar
        return this.isViewMode || (!this.isAddMode && !this.isEditMode);
    }

    refrescarEmpresa(): void {
        // this.loading = true; // Se elimina

        this.isViewMode = true;
        this.isAddMode = false;
        this.isEditMode = false;

        // Recarga la lista
        this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas));
        this.selectedEmpresa = null;

        this.loading = false; // Se elimina o se pone fuera de un setTimeout
    }

    
    verEmpresa(): void {
            verMensajeInformativo(this.messageService, 'info', 'Información', 'Use el icono del ojo en la tabla para ver la empresa.');
    }

    agregarEmpresa(): void {
        // Establece el modo a Agregar
        this.isViewMode = false;
        this.isAddMode = true;
        this.isEditMode = false;

        this.empresa = this.initForm(); // Limpia el formulario
        this.selectedEmpresa = null;
    }

    editarEmpresa(empresa: Empresa): void {
        if (empresa) {
            // Establece el modo a Editar
            this.isViewMode = false;
            this.isAddMode = false;
            this.isEditMode = true;

            // Carga la empresa seleccionada al formulario (clonación profunda)
            this.empresa = JSON.parse(JSON.stringify(empresa));
            this.selectedEmpresa = empresa; 
        }
    }
    

    vistaPrevia(empresa: Empresa): void {
        if (empresa) {
            // Carga los datos de la empresa seleccionada al formulario
            this.empresa = JSON.parse(JSON.stringify(empresa));

            // Establece el modo a Vista (solo lectura), deshabilitando Add y Edit
            this.isViewMode = false;
            this.isAddMode = false;
            this.isEditMode = false;

            this.selectedEmpresa = empresa; // Marca la fila
        } else {
            verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'No se ha seleccionado ninguna empresa para vista previa.');
        }
    }

    eliminarEmpresa(empresa: Empresa): void {
        if (!empresa) {
            return;
        }

        this.confirmationService.confirm({
            message: `¿Está seguro de que desea eliminar a la empresa ${empresa.razonsocial}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',

            accept: () => {
                const empresaAeliminar = empresa;

                this.currentEmpresas = this.currentEmpresas.filter(e => e.empresacod !== empresaAeliminar.empresacod);
                this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas)); 

                verMensajeInformativo(this.messageService, 'success', 'Éxito', `Empresa ${empresaAeliminar.empresacod} eliminada.`);

                this.selectedEmpresa = null;
            }
        });
    }
    cancelar(): void {
        this.refrescarEmpresa();
    }


    validarCampos(): boolean {
        // 1. Validación de campos de primer nivel
        if (esVacio(this.empresa.empresacod)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El campo Código de Empresa es obligatorio.');
            return false;
        }

        if (esVacio(this.empresa.ruc)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El campo RUC es obligatorio.');
            return false;
        }

        if (!validarRUC(this.empresa.ruc)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El RUC debe tener 11 dígitos numéricos.');
            return false;
        }

        if (esVacio(this.empresa.razonsocial)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'la Razón Social es obligatoria');
            return false;
        }

        if (esVacio(this.empresa.direccion)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'La Dirección es obligatoria.');
            return false;
        }

        // 2. Validaciones de Representante Legal
        const rl = this.empresa.representanteLegal;
        if (esVacio(rl.replegaldoctip) || esVacio(rl.replegaldocnro) || esVacio(rl.replegalnombres)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'Complete los campos obligatorios del Representante Legal (Tipo/Nro. Documento y Nombres).');
            return false;
        }

        // 2.1 Validación de formato del documento del Representante Legal (DNI)
        if (rl.replegaldoctip === '01' && !validarDNI(rl.replegaldocnro)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El DNI del Representante Legal debe tener 8 dígitos.');
            return false;
        }

        // 3. Validaciones de Responsable Planilla (Opcional, pero si se inicia, debe completarse)
        const rp = this.empresa.responsablePlanilla;
        if (rp.encargadoplanilladoctip || rp.encargadoplanilladocnro || rp.encargadoplanillanombres || rp.encargadoplanillaapepaterno || rp.encargadoplanillaapematerno) {
            if (esVacio(rp.encargadoplanilladoctip) || esVacio(rp.encargadoplanilladocnro) || esVacio(rp.encargadoplanillanombres)) {
                verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Si registra el Responsable de Planilla, complete al menos Tipo/Nro. Documento y Nombres.');
                return false;
            }

            // 3.1 Validación de formato del documento del Responsable de Planilla (DNI)
            if (rp.encargadoplanilladoctip === '01' && !validarDNI(rp.encargadoplanilladocnro)) {
                verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'El DNI del Responsable de Planilla debe tener 8 dígitos.');
                return false;
            }
        }

        // 4. Validaciones de Bancos (Cuenta Soles Requerida)
        const bancos = this.empresa.bancos;
        if (esVacio(bancos.ctasolespagobancocod) || esVacio(bancos.ctasolespagonumero)) {
            verMensajeInformativo(this.messageService, 'error', 'ERROR', 'Debe especificar el Banco y el Número de Cuenta en Soles.');
            return false;
        }

        // 5. Validaciones de Bancos (Cuenta Dólares - Opcional, pero si se inicia, debe completarse)
        if (bancos.ctadolarespagobancocod || bancos.ctadolarespagonumero) {
            if (esVacio(bancos.ctadolarespagobancocod) || esVacio(bancos.ctadolarespagonumero)) {
                verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Si registra datos de la Cuenta en Dólares, debe completar el Banco y el Número de Cuenta.');
                return false;
            }
        }

        return true;
    }

    guardar(): void {
        if (!this.validarCampos()) {
            return; 
        }

        // Convertir a mayúsculas
        this.empresa.razonsocial = aMayusculas(this.empresa.razonsocial);
        this.empresa.direccion = aMayusculas(this.empresa.direccion);
        this.empresa.representanteLegal.replegalapepaterno = aMayusculas(this.empresa.representanteLegal.replegalapepaterno);
        this.empresa.representanteLegal.replegalapematerno = aMayusculas(this.empresa.representanteLegal.replegalapematerno);
        this.empresa.representanteLegal.replegalnombres = aMayusculas(this.empresa.representanteLegal.replegalnombres);
        this.empresa.responsablePlanilla.encargadoplanillaapepaterno = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillaapepaterno);
        this.empresa.responsablePlanilla.encargadoplanillaapematerno = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillaapematerno);
        this.empresa.responsablePlanilla.encargadoplanillanombres = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillanombres);


        this.loading = true; 

        setTimeout(() => {
            if (this.isAddMode) {
                // Lógica para AGREGAR
                if (this.currentEmpresas.some(e => e.empresacod === this.empresa.empresacod)) {
                    verMensajeInformativo(this.messageService, 'error', 'ERROR', `El código de empresa ${this.empresa.empresacod} ya existe.`);
                    this.loading = false;
                    return;
                }
                
                // Agrega la nueva empresa (clonación profunda)
                this.currentEmpresas.push(JSON.parse(JSON.stringify(this.empresa)));
                verMensajeInformativo(this.messageService, 'success', 'Éxito', `Empresa ${this.empresa.empresacod} agregada correctamente.`);
            } else if (this.isEditMode) {
                // Lógica para EDITAR
                const index = this.currentEmpresas.findIndex(e => e.empresacod === this.empresa.empresacod);
                if (index !== -1) {
                    // Reemplaza el objeto original con la versión editada
                    this.currentEmpresas[index] = JSON.parse(JSON.stringify(this.empresa));
                    verMensajeInformativo(this.messageService, 'success', 'Éxito', `Empresa ${this.empresa.empresacod} actualizada correctamente.`);
                }
            }

            this.refrescarEmpresa(); 
            this.empresa = this.initForm(); 
            this.selectedEmpresa = null; 

            this.loading = false;
        }, 1000); 
    }
}