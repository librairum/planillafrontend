/* Milton Garriazo */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';

import { ConfirmationService, MessageService } from 'primeng/api';

import { PeriodosLaboralesComponent } from '../periodos-laborales/periodos-laborales.component';

import { TrabajadorService } from 'src/app/demo/service/trabajador.service';

import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
import { RegimenesPensionariosComponent } from '../regimenes-pensionarios/regimenes-pensionarios.component';
import { RemuneracionesComponent } from '../remuneraciones/remuneraciones.component';

@Component({
  standalone: true,
  selector: 'app-trabajador-detalle',
  templateUrl: './trabajador-detalle.component.html',
  styleUrls: ['./trabajador-detalle.component.css'],
  imports: [
    ToastModule,
    TableModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    CardModule,
    InputTextModule,
    PanelModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    TabViewModule,
    PeriodosLaboralesComponent,
    RegimenesPensionariosComponent,
    RemuneracionesComponent,
  ],
  providers: [MessageService, ConfirmationService]
})
export class TrabajadorDetalleComponent implements OnInit{
  trabajadorForm: FormGroup = this.fb.group({
    pla01empresacod: [''],
    pla01empleadocod: ['', Validators.required], //pk
    pla01planillacod: [''],
    pla01docuidentidadtipo: [''],
    pla01docuidentidadnro: [''],

    pla01apepaterno: [''],
    pla01apematerno: [''],
    pla01nombre1: [''],
    pla01nombre2: [''],
    pla01direccion: [''],
    pla01fechanacimiento: null,
    pla01telefono: [''],
    pla01fechaingreso: null,

    //ocultos

    pla01fechacese: null,
    pla01sexo: [''],
    pla01estado: [''],

    pla01trdatoslabregimenlaboral: [''],
    labregimenlaboraldes: [''],

    tipdocdesc: [''],

    //
    //Empresa
    //

    //-- Centro de costos
    pla01centrocostocod: [''],
    pla57descripcion: [''],
    //-- Puesto / Cargo
    pla01puestocod: [''],
    pla51descripcion: [''],
    //-- Banco remuneracion
    pla01ctaremubancocod: [''],
    desbancorem: [''],
    //-- Numero cuenta Remuneracion
    pla01ctaremunumero: [''],
    //-- Moneda Remuneracion
    pla01ctaremumoneda: [''],
    desremumoneda: [''],
    //-- Banco deposito CTS
    pla01ctactsbancocod: [''],
    desbancocts: [''],
    //-- Numero cuenta CTS
    pla01ctactsnumero: [''],
    //-- Moneda deposito CTS
    pla01ctactsmoneda: [''],
    desctsmoneda: [''],

    //Seguro Social

    pla01trdatossegsocialregsaludcod: [''],
    segsocialregsaluddes: [''],

    pla01trdatossegsocialregsaludfechainicio: null,

    pla01trdatossegsocialcoberturasalud: [''],
    pla01trdatossegsocialcoberturasaludfechainicio: null,

    pla01trdatossegsocialflagaportascrt: [''],
    pla01trdatossegsocialcoberturapension: [''],
    pla01trdatossegsocialflagaseguratupension: [''],
    pla01trdatossegsocialflagessaludmasvida: [''],

    // Tributarios
    pla01trdatostribflagquintaotrosingresos: [''],
    pla01trdatostribflagquintaexonerada: [''],
  });


  esModoVisualizacion: boolean = true;
  isNewRecord: boolean = false;

  // Diálogos de búsqueda en editar/crear trabajador

  displayBusquedaRegLaboralDialog: boolean = false;
  displayBusquedaTipoDocumentoDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService
  ) {
  }

  initForm(){
    this.trabajadorForm = this.fb.group({
          pla01empresacod: ['00004'], // 00004
          pla01empleadocod: ['', Validators.required], //pk
          pla01planillacod: [''],
          pla01docuidentidadtipo: [''],
          pla01docuidentidadnro: [''],

          pla01apepaterno: [''],
          pla01apematerno: [''],
          pla01nombre1: [''],
          pla01nombre2: [''],
          pla01direccion: [''],
          pla01fechanacimiento: null,
          pla01telefono: [''],
          pla01fechaingreso: null,

          //ocultos

          pla01fechacese: null,
          pla01sexo: [''],
          pla01estado: [''],

          pla01trdatoslabregimenlaboral: [''],
          labregimenlaboraldes: [''],

          tipdocdesc: [''],

          // Seguro Social

          pla01trdatossegsocialregsaludcod: [''],
          segsocialregsaluddes: [''],

          pla01trdatossegsocialregsaludfechainicio: null,

          pla01trdatossegsocialcoberturasalud: [''],
          pla01trdatossegsocialcoberturasaludfechainicio: null,

          pla01trdatossegsocialflagaportascrt: [''],
          pla01trdatossegsocialcoberturapension: [''],
          pla01trdatossegsocialflagaseguratupension: [''],
          pla01trdatossegsocialflagessaludmasvida: [''],

          //
          //Empresa
          //

          //-- Centro de costos
          pla01centrocostocod: [''],
          pla57descripcion: [''],
          //-- Puesto / Cargo
          pla01puestocod: [''],
          pla51descripcion: [''],
          //-- Banco remuneracion
          pla01ctaremubancocod: [''],
          desbancorem: [''],
          //-- Numero cuenta Remuneracion
          pla01ctaremunumero: [''],
          //-- Moneda Remuneracion
          pla01ctaremumoneda: [''],
          desremumoneda: [''],
          //-- Banco deposito CTS
          pla01ctactsbancocod: [''],
          desbancocts: [''],
          //-- Numero cuenta CTS
          pla01ctactsnumero: [''],
          //-- Moneda deposito CTS
          pla01ctactsmoneda: [''],
          desctsmoneda: [''],

          // Tributarios
          pla01trdatostribflagquintaotrosingresos: [''],
          pla01trdatostribflagquintaexonerada: [''],

          // Principales

          remuneraciones: this.fb.array([]),
          regimenespensionarios: this.fb.array([]),
          periodoslaborales: this.fb.array([]),

    });
  }

  //getters para los form arrays
  get remuneraciones(): FormArray {
    return this.trabajadorForm.get('remuneraciones') as FormArray;
  }
  get regimenespensionarios(): FormArray {
    return this.trabajadorForm.get('regimenespensionarios') as FormArray;
  }
  get periodoslaborales(): FormArray {
    return this.trabajadorForm.get('periodoslaborales') as FormArray;
  }



  ngOnInit(): void {
    this.initForm();

    const empresaId = this.route.snapshot.paramMap.get('empresaId'); // Obtiene el ID de la empresa
    const empleadoId = this.route.snapshot.paramMap.get('empleadoId'); // Obtiene el ID del empleado
    let modo = this.route.snapshot.queryParamMap.get('modo'); // Obtiene el modo (ver/editar/crear)

    console.log('Modo recibido:', modo);

    // Si el modo es null, establecer un valor predeterminado
    if (!modo) {
      console.warn('El modo no se recibió, estableciendo el modo predeterminado: "ver".');
      modo = 'ver'; // Valor predeterminado
    }

    // Configurar esModoVisualizacion según el modo
    this.esModoVisualizacion = modo === 'ver';
    this.isNewRecord = modo === 'nuevo';

    console.log('esModoVisualizacion establecido en:', this.esModoVisualizacion);
    console.log('isNewRecord establecido en:', this.isNewRecord);

    if (this.isNewRecord) {
      const nuevoCodigo = this.trabajadorService.GenerarNuevoCodigoTrabajador();
      this.trabajadorForm.patchValue({
        pla01empresacod: '00004',
        pla01empleadocod: nuevoCodigo,
      });
    }

    if (empresaId && empleadoId) {
      this.cargarTrabajador(empresaId, empleadoId); // Carga los datos del trabajador
    }

    this.actualizarEstadoFormulario();
  }

  actualizarEstadoFormulario(): void {
    if (this.esModoVisualizacion) {
      this.trabajadorForm.disable(); // Deshabilita el formulario
    } else {
      this.trabajadorForm.enable(); // Habilita el formulario
    }
  }



  cargarTrabajador(idempresa: string, idempleado: string): void {
    this.trabajadorService.GetTrabajadorById(idempresa, idempleado).subscribe({
      next: (trabajador) => {
        if(trabajador) {
          const raw = {
            ...trabajador,
            //concatenar nombres
            pla01nombre1: `${trabajador.pla01nombre1 || ''}${trabajador.pla01nombre2 ? ' ' + trabajador.pla01nombre2 : ''}`,
            pla01fechanacimiento: trabajador.pla01fechanacimiento || null,
            pla01fechaingreso: trabajador.pla01fechaingreso || null,
            pla01fechacese: trabajador.pla01fechacese || null,
            pla01sexo: trabajador.pla01sexo === 'M' ? 'M' : 'F', // Mapear sexo
            pla01estado: trabajador.pla01estado === 'A' ? 'Activo' : 'Inactivo', // Mapear estado


            // Seguro Social
            pla01trdatossegsocialregsaludfechainicio: trabajador.pla01trdatossegsocialcoberturasaludfechainicio || null,

            //corregir luego el manejo de 1 o 2
            pla01trdatossegsocialcoberturasalud: trabajador.pla01trdatossegsocialcoberturasalud || '',
            pla01trdatossegsocialcoberturasaludfechainicio: trabajador.pla01trdatossegsocialcoberturasaludfechainicio || null,

            pla01trdatossegsocialflagaportascrt: trabajador.pla01trdatossegsocialflagaportascrt === 'S' ? 'S' : 'N',
            pla01trdatossegsocialcoberturapension: trabajador.pla01trdatossegsocialcoberturapension || '',
            pla01trdatossegsocialflagaseguratupension: trabajador.pla01trdatossegsocialflagaseguratupension === 'S' ? 'S' : 'N',
            pla01trdatossegsocialflagessaludmasvida: trabajador.pla01trdatossegsocialflagessaludmasvida === 'S' ? 'S' : 'N',

            // Tributarios

            pla01trdatostribflagquintaotrosingresos : trabajador.pla01trdatostribflagquintaotrosingresos || 'N',
            pla01trdatostribflagquintaexonerada : trabajador.pla01trdatostribflagquintaexonerada || 'N',

          }

          this.trabajadorForm.reset(raw);
        }

        if(trabajador?.remuneraciones){
          // Inicializar los FormArray
          this.trabajadorForm.setControl(
            'remuneraciones',
            this.fb.array(
              (trabajador.remuneraciones ?? []).map((remuneracion) =>
                this.fb.group({
                  pla05conceptocod: [remuneracion.pla05conceptocod],
                  conceptodesc: [remuneracion.conceptodesc],
                  pla05importe: [remuneracion.pla05importe],
                })
              )
            )
          );
        }

        if (trabajador?.regimenespensionarios) {
          this.trabajadorForm.setControl(
            'regimenespensionarios',
            this.fb.array(
              (trabajador.regimenespensionarios ?? []).map((regimen) =>
                this.fb.group({
                  pla31regpensionariocod: [regimen.pla31regpensionariocod],
                  desregpensionario: [regimen.desregpensionario],
                  pla31regpensionariocupss: [regimen.pla31regpensionariocupss],
                  pla31fechaini: [regimen.pla31fechaini ? new Date(regimen.pla31fechaini) : null],
                  pla31fechafin: [regimen.pla31fechafin ? new Date(regimen.pla31fechafin) : null],
                  pla31flagcomisionmixta: [regimen.pla31flagcomisionmixta === '1' ? '1' : '0'],
                })
              )
            )
          );
        }

        if (trabajador?.periodoslaborales) {
          this.trabajadorForm.setControl(
            'periodoslaborales',
            this.fb.array(
              (trabajador.periodoslaborales ?? []).map((periodo) =>
                this.fb.group({
                  pla30codigo: [periodo.pla30codigo],
                  pla30fechaini: [periodo.pla30fechaini ? new Date(periodo.pla30fechaini) : null],
                  pla30fechafin: [periodo.pla30fechafin ? new Date(periodo.pla30fechafin) : null],
                  desmotivocese: [periodo.desmotivocese],
                })
              )
            )
          );
        }

        //console.log('Trabajador cargado:', trabajador);
      },
      error: (error) => {
        console.error('Error al cargar el trabajador:', error);
        verMensajeInformativo(
          this.messageService, 'error', 'Error', `No se pudo cargar la información del trabajador: ${error.message}`
        );
      }
    });
  }

  guardarEdicion(): void {
    if (this.trabajadorForm.valid) {

      const raw = this.trabajadorForm.value;

      const nombres = raw.pla01nombre1.split(' ');

      const trabajadorEditado = {
        ...raw,
        pla01nombre1: nombres[0] || '',
        pla01nombre2: nombres.slice(1).join(' ') || '',
        pla01fechanacimiento: raw.pla01fechanacimiento || null,
        pla01fechaingreso: raw.pla01fechaingreso || null,
        pla01fechacese: raw.pla01fechacese || null,
        pla01sexo: raw.pla01sexo === 'M' ? 'M' : 'F', // Mapear sexo
        pla01estado: raw.pla01estado === 'Activo' ? 'A' : 'I', // Mapear estado

        // Seguro Social
        pla01trdatossegsocialregsaludfechainicio: raw.pla01trdatossegsocialcoberturasaludfechainicio || null,

        //corregir luego el manejo de 1 o 2
        pla01trdatossegsocialcoberturasalud: raw.pla01trdatossegsocialcoberturasalud || '',
        pla01trdatossegsocialcoberturasaludfechainicio: raw.pla01trdatossegsocialcoberturasaludfechainicio || null,

        pla01trdatossegsocialflagaportascrt: raw.pla01trdatossegsocialflagaportascrt === 'S' ? 'S' : 'N',
        pla01trdatossegsocialcoberturapension: raw.pla01trdatossegsocialcoberturapension || '',
        pla01trdatossegsocialflagaseguratupension: raw.pla01trdatossegsocialflagaseguratupension === 'S' ? 'S' : 'N',
        pla01trdatossegsocialflagessaludmasvida: raw.pla01trdatossegsocialflagessaludmasvida === 'S' ? 'S' : 'N',

        // Tributarios

        pla01trdatostribflagquintaotrosingresos: raw.pla01trdatostribflagquintaotrosingresos === 'S' ? 'S' : 'N',
        pla01trdatostribflagquintaexonerada: raw.pla01trdatostribflagquintaexonerada === 'S' ? 'S' : 'N',
      };


      console.log('Guardando edición del trabajador:', trabajadorEditado);

      this.trabajadorService.ActualizarTrabajador(trabajadorEditado).subscribe({
        next: () => {
          verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Trabajador actualizado correctamente');
        },
        error: (err) => {
          verMensajeInformativo(this.messageService, 'error', 'Error', `No se pudo actualizar el trabajador: ${err.message}`);
        },
      });
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Complete todos los campos requeridos');
    }
  }

  guardarNuevoRegistro(): void {
    if (this.trabajadorForm.valid) {

      const raw = this.trabajadorForm.value;

      const nombres = raw.pla01nombre1.split(' ');


      const nuevoTrabajador = {
        ...raw,
        pla01nombre1: nombres[0] || '',
        pla01nombre2: nombres.slice(1).join(' ') || '',
        pla01fechanacimiento: raw.pla01fechanacimiento || null,
        pla01fechaingreso: raw.pla01fechaingreso || null,
        pla01fechacese: raw.pla01fechacese || null,
        pla01sexo: raw.pla01sexo === 'M' ? 'M' : 'F', // Mapear sexo
        pla01estado: raw.pla01estado === 'Activo' ? 'A' : 'I', // Mapear estado

        // Seguro Social
        pla01trdatossegsocialregsaludfechainicio: raw.pla01trdatossegsocialcoberturasaludfechainicio || null,

        //corregir luego el manejo de 1 o 2
        pla01trdatossegsocialcoberturasalud: raw.pla01trdatossegsocialcoberturasalud || '',
        pla01trdatossegsocialcoberturasaludfechainicio: raw.pla01trdatossegsocialcoberturasaludfechainicio || null,

        pla01trdatossegsocialflagaportascrt: raw.pla01trdatossegsocialflagaportascrt === 'S' ? 'S' : 'N',
        pla01trdatossegsocialcoberturapension: raw.pla01trdatossegsocialcoberturapension || '',
        pla01trdatossegsocialflagaseguratupension: raw.pla01trdatossegsocialflagaseguratupension === 'S' ? 'S' : 'N',
        pla01trdatossegsocialflagessaludmasvida: raw.pla01trdatossegsocialflagessaludmasvida === 'S' ? 'S' : 'N',

        // Tributarios

        pla01trdatostribflagquintaotrosingresos: raw.pla01trdatostribflagquintaotrosingresos === 'S' ? 'S' : 'N',
        pla01trdatostribflagquintaexonerada: raw.pla01trdatostribflagquintaexonerada === 'S' ? 'S' : 'N',
      }

      console.log('Guardando nuevo trabajador:', nuevoTrabajador);

      this.trabajadorService.CrearTrabajador(nuevoTrabajador).subscribe({
        next: () => {
          verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Trabajador creado correctamente');

          this.regresar(); // Redirige al menú de trabajadores después de guardar
        },
        error: (err) => {
          verMensajeInformativo(this.messageService, 'error', 'Error', `No se pudo crear el trabajador: ${err.message}`);
        },
      });
    } else {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Complete todos los campos requeridos');
    }
  }

  regresar(): void {
    this.router.navigate(['/home/maestros/trabajador']); // Redirige al menú de trabajadores
  }

  verificarDatosFormulario(){
    console.log('Datos del formulario:', this.trabajadorForm.value);
    console.log('Regímenes Pensionarios:', this.regimenespensionarios.value);
    console.log('Remuneraciones:', this.remuneraciones.value);
    console.log('Periodos Laborales:', this.periodoslaborales.value);
    console.log('Estado de la variable de visualizacion: ', this.esModoVisualizacion);
  }




  // Búsquedas modal para regimen laboral

    regimenesLaborales: { codigo: string; descripcion: string }[] = [
      { codigo: '01', descripcion: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N°. 728' },
      { codigo: '02', descripcion: 'PÚBLICO GENERAL -DECRETO LEGISLATIVO N°. 728' },
      { codigo: '03', descripcion: 'PROFESORADO - LEY N°. 24029' },
      { codigo: '04', descripcion: 'MAGISTERIO - LEY N°. 29062  ' },
    ];

    abrirBusquedaRegLaboral() {
      if (!this.esModoVisualizacion) {
        this.displayBusquedaRegLaboralDialog = true; // Muestra el modal
      }
    }

    seleccionarRegimenLaboral(regimen: { codigo: string; descripcion: string }) {
      this.trabajadorForm.patchValue({
        pla01trdatoslabregimenlaboral: regimen.codigo,
        labregimenlaboraldes: regimen.descripcion
      });
      this.displayBusquedaRegLaboralDialog = false; // Cierra el modal
    }

    // Búsqueda modal para tipo de documento

    tiposDocumentos: { codigo: string; descripcion: string }[] = [
      { codigo: '01', descripcion: 'DNI' },
      { codigo: '04', descripcion: 'CARNET DE EXTRANJERÍA' },
      { codigo: '07', descripcion: 'PASAPORTE' },
    ];

    abrirBusquedaTipoDocumento() {
      if (!this.esModoVisualizacion) {
        this.displayBusquedaTipoDocumentoDialog = true; // Muestra el modal
      }
    }

    seleccionarTipoDocumento(tipo: { codigo: string; descripcion: string }) {
      this.trabajadorForm.patchValue({
        pla01docuidentidadtipo: tipo.codigo,
        tipdocdesc: tipo.descripcion
      });
      this.displayBusquedaTipoDocumentoDialog = false; // Cierra el modal
    }


  // Empresa modals

  // Centro de costos

  mostrarModalCentroCostos: boolean = false;
  centroCostos: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalCentroCostos(): void{
    this.mostrarModalCentroCostos = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.centroCostos = [
      { codigo: '001', descripcion: 'por defecto' },
    ];
  }

  seleccionarCentroCosto(centroCosto: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01ctaremubancocod: centroCosto.codigo,
      pla01ctaremunumero: centroCosto.descripcion,
    });

    // Cerrar el modal
    this.mostrarModalCentroCostos = false;

  }

  // Cargos

  mostrarModalCargos: boolean = false;
  cargos: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalCargos(): void{
    this.mostrarModalCargos = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.cargos = [
      { codigo: '002', descripcion: 'por defecto' },
    ];
  }

  seleccionarCargo(cargo: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01puestocod: cargo.codigo,
      pla51descripcion: cargo.descripcion,
    });

    // Cerrar el modal
    this.mostrarModalCargos = false;

  }

  // Bancos Remuneracion

  mostrarBancosRemuneracion: boolean = false;
  bancosRemuneracion: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalBancosRemuneracion(): void{
    this.mostrarBancosRemuneracion = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.bancosRemuneracion = [
      { codigo: '01', descripcion: 'BANCO CENTRAL DE RESERVA' },
      { codigo: '02', descripcion: 'BANCO DE CREDITO BCP' },
      { codigo: '03', descripcion: 'BANCO CONTINENTAL' },
    ];
  }

  seleccionarBancoRemuneracion(banco: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01ctaremubancocod: banco.codigo,
      desbancorem: banco.descripcion,
    });

    // Cerrar el modal
    this.mostrarBancosRemuneracion = false;

  }

  // Monedas Remuneracion

  mostrarMonedasRemuneracion: boolean = false;
  monedasRemuneracion: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalMonedasRemuneracion(): void{
    this.mostrarMonedasRemuneracion = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.monedasRemuneracion = [
      { codigo: 'D', descripcion: 'DOLARES' },
      { codigo: 'E', descripcion: 'EUROS' },
      { codigo: 'S', descripcion: 'NUEVOS SOLES' },
    ];
  }

  seleccionarMonedaRemuneracion(moneda: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01ctaremumoneda: moneda.codigo,
      desremumoneda: moneda.descripcion,
    });

    // Cerrar el modal
    this.mostrarMonedasRemuneracion = false;

  }


  // Bancos CTS

  mostrarBancosCTS: boolean = false;
  bancosCTS: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalBancosCTS(): void{
    this.mostrarBancosCTS = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.bancosCTS = [
      { codigo: '01', descripcion: 'BANCO CENTRAL DE RESERVA' },
      { codigo: '02', descripcion: 'BANCO DE CREDITO BCP' },
      { codigo: '03', descripcion: 'BANCO CONTINENTAL' },
    ];
  }

  seleccionarBancoCTS(banco: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01ctactsbancocod: banco.codigo,
      desbancocts: banco.descripcion,
    });

    // Cerrar el modal
    this.mostrarBancosCTS = false;

  }

  // Monedas CTS

  mostrarMonedasCTS: boolean = false;
  monedasCTS: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalMonedasCTS(): void{
    this.mostrarMonedasCTS = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.monedasCTS = [
      { codigo: 'D', descripcion: 'DOLARES' },
      { codigo: 'E', descripcion: 'EUROS' },
      { codigo: 'S', descripcion: 'NUEVOS SOLES' },
    ];
  }

  seleccionarMonedaCTS(moneda: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01ctactsmoneda: moneda.codigo,
      desctsmoneda: moneda.descripcion,
    });

    // Cerrar el modal
    this.mostrarMonedasCTS = false;

  }


  // Seguro Social modal

  mostrarModalRegimenSalud: boolean = false;
  regimenesSalud: Array<{ codigo: string; descripcion: string }> = [];

  abrirModalRegimenSalud(): void {
    this.mostrarModalRegimenSalud = true;

    // Cargar los datos del modal (puedes reemplazar esto con datos reales)
    this.regimenesSalud = [
      { codigo: '00', descripcion: 'ESSALUD REGULAR (Exclusivamente)' },
      { codigo: '01', descripcion: 'ESSALUD REGULAR Y EPS/SERV. PROP.' },
    ];
  }

  seleccionarRegimenSalud(regimen: { codigo: string; descripcion: string }): void {
    // Actualizar los valores en el formulario reactivo
    this.trabajadorForm.patchValue({
      pla01trdatossegsocialregsaludcod: regimen.codigo,
      segsocialregsaluddes: regimen.descripcion,
    });

    // Cerrar el modal
    this.mostrarModalRegimenSalud = false;

    console.log('Régimen de salud seleccionado:', regimen);
  }

}
