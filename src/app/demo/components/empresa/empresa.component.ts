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
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

// Importación de modelos
import { Empresa, RepresentanteLegal, ResponsablePlanilla, Banco } from 'src/app/demo/model/Empresa'; 

// Importación de Funciones Utilitarias
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
    ConfirmDialogModule,
    ProgressSpinnerModule 
  ],
  providers: [MessageService, ConfirmationService], 
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})

export class EmpresaComponent implements OnInit {

  empresa: Empresa = this.initForm(); // Cambio de nombre de la función

  loading: boolean = false; 

  // Array para almacenar las empresas 
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

//Métodos de Control

  refrescarEmpresa(): void {
  this.loading = true; 
  
  setTimeout(() => {
    this.isViewMode = true;
    this.isAddMode = false;
    this.isEditMode = false;
    
    // Recarga la lista 
    this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas)); 
    this.selectedEmpresa = null;

    this.loading = false; 
  }, 1000); 
  }

  verEmpresa(): void {
  }

  agregarEmpresa(): void {
    // Establece el modo a Agregar
    this.isViewMode = false;
    this.isAddMode = true;
    this.isEditMode = false;
    
    this.empresa = this.initForm(); // Limpia el formulario
    this.selectedEmpresa = null;
  }

  editarEmpresa(): void {
    if (this.selectedEmpresa) {
        // Establece el modo a Editar
        this.isViewMode = false;
        this.isAddMode = false;
        this.isEditMode = true;
        
        this.empresa = JSON.parse(JSON.stringify(this.selectedEmpresa)); // Carga los datos
    } 
  }

  eliminarEmpresa(): void {
    if (!this.selectedEmpresa) {
        return;
    }

    this.confirmationService.confirm({
        message: `¿Está seguro de que desea eliminar a la empresa ${this.selectedEmpresa.razonsocial}?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button',

        accept: () => {
            const empresaAeliminar = this.selectedEmpresa!; 
            
            // Lógica de eliminación (simulación)
            this.currentEmpresas = this.currentEmpresas.filter(e => e.empresacod !== empresaAeliminar.empresacod);
            this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas)); // Actualiza la tabla

            // Uso de verMensajeInformativo
            verMensajeInformativo(this.messageService, 'success', 'Éxito', `Empresa ${empresaAeliminar.empresacod} eliminada.`);

            this.selectedEmpresa = null; 
        }
    });
  }

  
  validarCampos(): boolean {
    // 1. Validación de campos de primer nivel
    if (esVacio(this.empresa.empresacod)) {
      verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El campo Código de Empresa es obligatorio.');
      return false; // Validación fallida
    }
    
    if (esVacio(this.empresa.ruc)) {
      verMensajeInformativo(this.messageService, 'error', 'ERROR', 'El campo RUC es obligatorio.');
      return false;
    }
    
    if(!validarRUC(this.empresa.ruc)){
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
      verMensajeInformativo(this.messageService, 'error', 'ERROR', 'Debe seleccionar el Banco y número de Cuenta Soles.');
      return false;      
    }
    
    return true; 
  }

  guardar(): void {
    if (!this.validarCampos()) {
      // El mensaje ya se muestra dentro de validarCampos()
      return;
    }

    this.empresa.razonsocial = aMayusculas(this.empresa.razonsocial);
    this.empresa.direccion = aMayusculas(this.empresa.direccion);
    
    // Representante Legal
    this.empresa.representanteLegal.replegalnombres = aMayusculas(this.empresa.representanteLegal.replegalnombres);
    this.empresa.representanteLegal.replegalapepaterno = aMayusculas(this.empresa.representanteLegal.replegalapepaterno);
    this.empresa.representanteLegal.replegalapematerno = aMayusculas(this.empresa.representanteLegal.replegalapematerno);

    // Responsable Planilla
    this.empresa.responsablePlanilla.encargadoplanillanombres = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillanombres);
    this.empresa.responsablePlanilla.encargadoplanillaapepaterno = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillaapepaterno);
    this.empresa.responsablePlanilla.encargadoplanillaapematerno = aMayusculas(this.empresa.responsablePlanilla.encargadoplanillaapematerno);

    // Bancos
    this.empresa.bancos.ctasolespagonumero = aMayusculas(this.empresa.bancos.ctasolespagonumero);
    this.empresa.bancos.ctadolarespagonumero = aMayusculas(this.empresa.bancos.ctadolarespagonumero);
    

    if (this.isAddMode) {
      // 1. Verificar si el código ya existe 
      if (this.currentEmpresas.some(e => e.empresacod === this.empresa.empresacod)) {
        verMensajeInformativo(this.messageService, 'error', 'Error', `El Código ${this.empresa.empresacod} ya existe.`);
        return;
      }

      // Añadir la nueva empresa a la lista
      this.currentEmpresas.push(this.empresa); 
      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Empresa agregada exitosamente.');

    } else if (this.isEditMode) {
      // Simulación: Encontrar y reemplazar la empresa editada
      const index = this.currentEmpresas.findIndex(e => e.empresacod === this.empresa.empresacod);
      if (index > -1) {
        // Clonar la empresa para asegurar que no haya referencias cruzadas inesperadas en la lista simulada.
        this.currentEmpresas[index] = JSON.parse(JSON.stringify(this.empresa)); 
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Cambios guardados exitosamente.');
      }
    }
    //Permite la actualización de la lista de empresas
    this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas)); 
    this.isViewMode = true;
    this.isAddMode = false;
    this.isEditMode = false;
    this.selectedEmpresa = null;
  }

  cancelar(): void {
    this.isViewMode = true;
    this.isAddMode = false;
    this.isEditMode = false;

    this.empresa = this.initForm();
    this.selectedEmpresa = null;
  }

  // Método auxiliar para deshabilitar campos en vista
  isDisabled(): boolean {
    return this.isViewMode;
  }
}