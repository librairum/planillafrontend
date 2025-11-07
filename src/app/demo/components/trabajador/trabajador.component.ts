/* Milton Garriazo */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule, EditableRow } from 'primeng/table';
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

import { ConfirmationService, MessageService } from 'primeng/api';

import { Trabajador } from '../../model/Trabajador';



import { TrabajadorService } from '../../service/trabajador.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';
@Component({
  selector: 'app-trabajador',
  standalone: true,
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
      CalendarModule
    ],
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css'],
  providers: [MessageService, ConfirmationService, EditableRow],
})
export class TrabajadorComponent implements OnInit{

  trabajadorForm: FormGroup = this.fb.group({}); //Quitar el = luego
  trabajadorList: Trabajador[] = []; //Quitar el = luego

  /*isEditing: boolean = false;
  editingRowIndex: number | null = null;
  editingConcepto: Concepto | null = null;
  editingRows: { [s: string]: boolean } = {};
  editingData: any = {};
  isNew: boolean = false;
  clonedConceptos: { [s: string]: Concepto } = {};
  items: any[] = [];
  isEditingAnyRow: boolean = false;*/

  rowsPerPage: number = 10; // Numero de filas por página

  // Ver detalle
  displayDialog: boolean = false;
  trabajadorActual = {} as Trabajador;
  esModoVisualizacion: boolean = false;
  isNewRecord: boolean = false;

  // Diálogos de búsqueda en editar/crear trabajador
  displayTipoCalculoDialog: boolean = false;
  displayConceptoTipoDialog: boolean = false;
  displaySubTipoDialog: boolean = false;
  displayConceptoSunatDialog: boolean = false;

  constructor(
    private trabajadorService: TrabajadorService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router,
    //private globalService: GlobalService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarTrabajadores();
  }

  initForm() {
    this.trabajadorForm = this.fb.group({
      pla01empresacod: ['', Validators.required],
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
      pla01centrocostocod: [''],

      //ocultos

      pla01fechacese: null,
      pla01sexo: [''],
      pla01estado: [''],

      pla01puestocod: [''],
      pla01ctaremunbancocod: [''],
      pla01ctaremunumero: [''],
      pla01ctaremunmoneda: [''],

      pla01trdatoslabregimenlaboral: [''],
      labregimenlaboraldes: [''],
    })
  }

  cargarTrabajadores(): void {
      this.trabajadorService.GetTrabajadores().subscribe({
        next: (data) => {
          this.trabajadorList = data.map(trabajador => ({
            ...trabajador,
            apellidosynombres: `${trabajador.pla01apepaterno || ''} ${trabajador.pla01apematerno || ''} ${trabajador.pla01nombre1 || ''} ${trabajador.pla01nombre2 || ''}`.trim()
          }));
        },
        error: (error) => {
          verMensajeInformativo(
            this.messageService,
            'error',
            'Error',
            'Error al cargar conceptos'
          );
        },
      });
    }




    abrirDetalleTrabajador(trabajador: Trabajador | null, modoVisualizacion: boolean = false) {
      if (trabajador) {
        // Si es edición o visualización, carga los datos en el formulario
        const raw = {
          ...trabajador,
          // Concatenar nombres, asi esta en el codigo original
          pla01nombre1: `${trabajador.pla01nombre1 || ''}${trabajador.pla01nombre2 ? ' ' + trabajador.pla01nombre2 : ''}`,
          pla01fechanacimiento: trabajador.pla01fechanacimiento || null,
          pla01fechaingreso: trabajador.pla01fechaingreso || null,
          pla01fechacese: trabajador.pla01fechacese || null,
          pla01sexo: trabajador.pla01sexo === 'M' ? 'M' : 'F', // Ejemplo de mapeo
          pla01estado: trabajador.pla01estado === 'A' ? 'Activo' : 'Inactivo', // Ejemplo de mapeo
        };

        this.trabajadorForm.reset(raw);
      } else {
        // Si es nuevo, resetea el formulario con valores por defecto
        this.trabajadorForm.reset({
          pla01empresacod: '00004', // Código de empresa actual
          pla01empleadocod: '', // Código vacío para nuevo trabajador
          pla01planillacod: '',
          pla01docuidentidadtipo: '',
          pla01docuidentidadnro: '',
          pla01apepaterno: '',
          pla01apematerno: '',
          pla01nombre1: '',
          pla01nombre2: '',
          pla01direccion: '',
          pla01fechanacimiento: null,
          pla01telefono: '',
          pla01fechaingreso: null,
          pla01centrocostocod: '',
          pla01fechacese: null,
          pla01sexo: 'M', // Valor por defecto
          pla01estado: 'A', // Valor por defecto
          pla01puestocod: '',
          pla01ctaremunbancocod: '',
          pla01ctaremunumero: '',
          pla01ctaremunmoneda: '',
        });
      }

      this.esModoVisualizacion = modoVisualizacion;
      this.isNewRecord = !trabajador;
      this.displayDialog = true;

      // Habilita o deshabilita el formulario según el modo
      if (modoVisualizacion) {
        this.trabajadorForm.disable();
      } else {
        this.trabajadorForm.enable();
      }
    }

    nuevoTrabajador() {

    }

    guardarTrabajador() {
      if (this.trabajadorForm.valid) {
        const raw = this.trabajadorForm.value;

        // Separar nombres concatenados
        const nombres = raw.pla01nombre1.split(' ');
        const trabajadorEditado = {
          ...raw,
          pla01nombre1: nombres[0] || '', // Primer nombre
          pla01nombre2: nombres.slice(1).join(' ') || '', // Segundo nombre (si existe)
          pla01fechanacimiento: raw.pla01fechanacimiento || null,
          pla01fechaingreso: raw.pla01fechaingreso || null,
          pla01fechacese: raw.pla01fechacese || null,
        };

        if (this.isNewRecord) {
          this.trabajadorService.CrearTrabajador(trabajadorEditado).subscribe({
            next: () => {
              verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Trabajador creado correctamente');
              this.cargarTrabajadores();
              this.displayDialog = false;
            },
            error: (err) => {
              verMensajeInformativo(this.messageService, 'error', 'Error', `No se pudo crear el trabajador: ${err.message}`);
            },
          });
        } else {
          this.trabajadorService.ActualizarTrabajador(trabajadorEditado).subscribe({
            next: () => {
              verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Trabajador actualizado correctamente');
              this.cargarTrabajadores();
              this.displayDialog = false;
            },
            error: (err) => {
              verMensajeInformativo(this.messageService, 'error', 'Error', `No se pudo actualizar el trabajador: ${err.message}`);
            },
          });
        }
      } else {
        verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Complete todos los campos requeridos');
      }
    }

    verTrabajador(trabajador: Trabajador){
      this.trabajadorActual = {...trabajador};
      this.abrirDetalleTrabajador(this.trabajadorActual, true);
    }

    cerrarTrabajador() {
      this.displayDialog = false;
      this.esModoVisualizacion = false;
      this.isNewRecord = false;
    }

    editarTrabajador(trabajador: Trabajador) {
      this.isNewRecord = false;
      this.esModoVisualizacion = false;

      this.trabajadorActual = { ...trabajador }; // Haz una copia para editar
      this.abrirDetalleTrabajador(this.trabajadorActual, false); // Carga los datos en el formulario y abre el modal en modo edición
    }

    eliminarTrabajador(trabajador: Trabajador) {

    }




    abrirBusquedaRegLaboral() {

    }
}
