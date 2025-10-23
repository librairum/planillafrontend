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

  empresa: Empresa = this.initializeEmpresa();

  loading: boolean = false;

  // Array para almacenar las empresas (se usa para la tabla)
  empresas: Empresa[] = []; 
  rowsPerPage: number = 10; 

  // Estado de la UI: 'view' (ver), 'edit' (editar), 'add' (agregar)
  mode: 'view' | 'edit' | 'add' = 'view';
  
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
  
  // Empresas simuladas para la carga inicial 
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

  private initializeEmpresa(): Empresa {
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

  // --- Métodos de Control ---

 refrescarEmpresa(): void {
  this.loading = true; 
  
  setTimeout(() => {
    this.mode = 'view';
    this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas));
    this.selectedEmpresa = null;

    this.loading = false; 

  }, 1000); 
  }

  verEmpresa(): void {

  }

  agregarEmpresa(): void {
    // Validación de código repetido al intentar agregar
    if (this.mode === 'add' && this.empresa.empresacod && this.currentEmpresas.some(e => e.empresacod === this.empresa.empresacod)) {
        this.messageService.add({severity:'error', summary:'Error', detail:'El Código de Empresa ya existe.'});
        return; 
    }
    this.mode = 'add';
    this.empresa = this.initializeEmpresa(); 
  }

  editarEmpresa(): void {
    if (this.selectedEmpresa) {
        this.mode = 'edit';
        this.empresa = JSON.parse(JSON.stringify(this.selectedEmpresa)); 
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
            this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas));

            this.messageService.add({severity:'success', summary:'Éxito', detail:`Empresa ${empresaAeliminar.empresacod} eliminada.`});

            this.selectedEmpresa = null; 
        }
    });
  }

  validarCampos(): boolean {
    if (!this.empresa.empresacod || !this.empresa.ruc || !this.empresa.razonsocial) {
      return false;
    }
    if (!this.empresa.representanteLegal.replegalnombres || !this.empresa.bancos.ctasolespagonumero) {      
    }
    return true; 
  }

  guardar(): void {
    if (!this.validarCampos()) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Faltan campos por completar.'});
      return;
    }

    if (this.mode === 'add') {
      // 1. Verificar si el código ya existe (solo al agregar)
      if (this.currentEmpresas.some(e => e.empresacod === this.empresa.empresacod)) {
          this.messageService.add({severity:'error', summary:'Error', detail:`El Código ${this.empresa.empresacod} ya existe.`});
          return;
      }

      // Simulación: Añadir la nueva empresa a la lista
      this.currentEmpresas.push(this.empresa); 
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Empresa agregada exitosamente.'});

    } else if (this.mode === 'edit') {
      // Simulación: Encontrar y reemplazar la empresa editada
      const index = this.currentEmpresas.findIndex(e => e.empresacod === this.empresa.empresacod);
      if (index > -1) {
          this.currentEmpresas[index] = this.empresa;
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Cambios guardados exitosamente.'});
      }
    }
    
    this.empresas = JSON.parse(JSON.stringify(this.currentEmpresas)); 
    this.mode = 'view';
    this.selectedEmpresa = null;
  }

  cancelar(): void {
    this.mode = 'view';
    this.empresa = this.initializeEmpresa();
    this.selectedEmpresa = null;
  }

  isDisabled(): boolean {
    return this.mode === 'view';
  }
}