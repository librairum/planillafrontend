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

import { ConfirmationService, MessageService } from 'primeng/api';

import { Concepto } from '../../model/Concepto';

import { TipoCalculo, ConceptoSunat, ConceptoTipo, SubTipoConcepto } from '../../model/Concepto';


import { ConceptoService } from '../../service/concepto.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-concepto',
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
  ],
  templateUrl: './concepto.component.html',
  styleUrls: ['./concepto.component.css'],
  providers: [MessageService, ConfirmationService, EditableRow],
})
export class ConceptoComponent  implements OnInit{

    conceptoForm: FormGroup = this.fb.group({}); //Quitar el = luego
    conceptoList: Concepto[] = []; //Quitar el = luego

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
    conceptoActual = {} as Concepto;
    esModoVisualizacion: boolean = false;
    isNewRecord: boolean = false;

    // Diálogos de búsqueda en editar/crear concepto
    displayTipoCalculoDialog: boolean = false;
    displayConceptoTipoDialog: boolean = false;
    displaySubTipoDialog: boolean = false;
    displayConceptoSunatDialog: boolean = false;
    displayConceptosEstandarDialog: boolean = false; // Controla la visibilidad del modal
    conceptosEstandar: { codigo: string; descripcion: string }[] = []; // Lista de conceptos estándar



    // Datos de los catálogos
    tiposCalculo: TipoCalculo[] = [
      { codigo: '01', descripcion: 'Calculo Planillas' },
      { codigo: '02', descripcion: 'Calculo Provision Vacaciones' },
      { codigo: '03', descripcion: 'Calculo Provision Gratificacion' },
      { codigo: '04', descripcion: 'Calculo Provision CTS' }
    ];

    conceptosTipo: ConceptoTipo[] = [
      { codigo: '01', descripcion: 'Ingreso' },
      { codigo: '02', descripcion: 'Egreso' },
      { codigo: '03', descripcion: 'Aportes' },
      { codigo: '04', descripcion: 'Otros' }
    ];

    subTiposConcepto: SubTipoConcepto[] = [
      { conceptoTipoCod: '04', codigo: '01', descripcion: 'Conceptos Fijos' },
      { conceptoTipoCod: '04', codigo: '02', descripcion: 'Concepto Asistencia' },
      { conceptoTipoCod: '04', codigo: '04', descripcion: 'Bases' },
      { conceptoTipoCod: '04', codigo: '08', descripcion: 'Netos' },
      { conceptoTipoCod: '04', codigo: '09', descripcion: 'Adelantos' },
      { conceptoTipoCod: '04', codigo: '11', descripcion: 'Totales' },
      { conceptoTipoCod: '04', codigo: '12', descripcion: 'Asistencia Fechas' },
      { conceptoTipoCod: '04', codigo: '99', descripcion: 'Otros' }
    ];

    conceptosSunat: ConceptoSunat[] = [
      { codigoSunat: '0101', descripcion: 'ALIMENTACIÓN PRINCIPAL EN DINERO' },
      { codigoSunat: '0102', descripcion: 'ALIMENTACIÓN PRINCIPAL EN ESPECIE' },
      { codigoSunat: '0103', descripcion: 'COMISIONES O DESTAJO' },
      { codigoSunat: '0104', descripcion: 'COMISIONES EVENTUALES A TRABAJADOR...' },
      { codigoSunat: '0105', descripcion: 'TRABAJO EN SOBRETIEMPO (HORAS EXT...' },
      { codigoSunat: '0106', descripcion: 'TRABAJO EN SOBRETIEMPO (HORAS EXT...' },
      { codigoSunat: '0107', descripcion: 'TRABAJO EN DÍA FERIADO O DÍA DE DES...' }
    ];


    constructor(
      private conceptoService: ConceptoService,
      private fb: FormBuilder,
      private confirmationService: ConfirmationService,
      //private bS: BreadcrumbService,
      private router: Router,
      //private globalService: GlobalService,
      private messageService: MessageService
    ) {}

    ngOnInit(): void {
      /*this.bS.setBreadcrumbs([
                  { icon: 'pi pi-home', routerLink: '/Home' },
                  { label: 'Bancos', routerLink: '/Home/banco' }
              ]);
              this.bS.currentBreadcrumbs$.subscribe(bc => {
                  this.items = bc;
              })*/
      this.initForm();
      this.cargarConceptos();
    }

    initForm() {
      this.conceptoForm = this.fb.group({

        pla10empresacod: [''],
        pla10conceptocod: ['', Validators.required],
        pla10conceptodesc: ['', Validators.required],
        pla10conceptoalias: [''],
        pla10flagclase: [''], //Formulable o no
        pla10flagimpresion: [''],
        pla10flagactivo: [''],
        pla10flagconfigurable: [''],
        pla10tipoconceptocod: [''],
        pla10subtipoconceptocod: [''],
        pla10tipocalculocod: [''],
        pla10conceptosunatcod: [''],
        pla10formula: [''],
        pla10formulaalias: [''],
        pla10comentario: [''],
        pla10flagestandar: [''],
        pla10conceptopadrecod: [''],

        pla10flagestandardesc: [''],

        conceptotipodesc: [''], //corresponde a la quinta columna del formulario escritorio
        conceptosubtipodesc: [''],
        calculotipodesc: [''],
        conceptosunatdesc: [''],

        afectacionesSunat: [[]],
        afectacionOtros: [[]],
        planillasAsignadas: [[]],
        regimenesLaborales: [[]],
      });
    }

    // cargar data
    cargarConceptos(): void {
      this.conceptoService.GetConceptos().subscribe({
        next: (data) => (this.conceptoList = data),
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



    // helper para togglear flags en la fila y mantener 'S'/'N'
    /*
    onToggleFlag(
      concepto: Concepto,
      field:
        | 'pla10flagactivo'
        | 'pla61flagsectorpublico'
        | 'pla61flagactivo',
      checked: boolean
    ): void {
      concepto[field] = checked ? 'S' : 'N';
    }*/


    // helper para togglear flags en la fila y mantener 'S'/'N'
        onToggleFlag(concepto: Concepto,
          field: 'pla10flagactivo' | 'pla10flagimpresion' | 'pla10flagconfigurable' | 'pla10flagclase' | 'pla10flagestandar', checked: boolean): void {
          concepto[field] = checked ? 'S' : 'N';
        }

      // Mostrar guia de ayuda para el concepto
      mostrarAyuda(): void {
        const pdfUrl = 'assets/pdf/guia-referencia.pdf'; // Ruta relativa al archivo PDF
        window.open(pdfUrl, '_blank'); // Abre el archivo en una nueva ventana
      }

      abrirModalConcepto(concepto: Concepto | null, modoVisualizacion: boolean = false) {
        if (concepto) {
          // Si es edición o visualización, carga los datos en el formulario

          const raw = {
            ...concepto,
            pla10flagimpresion: concepto.pla10flagimpresion === 'S',
            pla10flagconfigurable: concepto.pla10flagconfigurable === 'S',
            pla10flagclase: concepto.pla10flagclase === 'F',
            pla10flagactivo: concepto.pla10flagactivo === 'S',
            pla10flagestandar: concepto.pla10flagestandar === 'S'
          }

          this.conceptoForm.reset(raw);
        } else {
          // Si es nuevo, resetea el formulario
          this.conceptoForm.reset({
            pla10conceptocod: this.conceptoService.GenerarNuevoCodigoConcepto(),
            afectacionesSunat: [],
            afectacionOtros: [],
            planillasAsignadas: [],
            regimenesLaborales: [],
            // ...otros valores por defecto si necesitas
          });
        }

        this.esModoVisualizacion = modoVisualizacion;
        this.isNewRecord = !concepto;
        this.displayDialog = true;

        // Habilita o deshabilita el formulario según el modo
        if (modoVisualizacion) {
          this.conceptoForm.disable();
        } else {
          this.conceptoForm.enable();
        }
      }

      verConcepto(concepto: Concepto) {
        this.conceptoActual = { ...concepto };
        //console.log(this.conceptoActual.afectacionesSunat)
        this.abrirModalConcepto(concepto, true);
      }

      cerrarConcepto(){
        this.displayDialog = false;
        this.esModoVisualizacion = false;
        this.isNewRecord = false; // Asegurarse de resetear esto también
      }

      editarConcepto(concepto: Concepto) {
        this.isNewRecord = false;
        this.esModoVisualizacion = false;

        this.conceptoActual = { ...concepto }; // Haz una copia para editar
        this.abrirModalConcepto(concepto, false); // Carga los datos en el formulario y abre el modal en modo edición

        /*this.esModoVisualizacion = false;
        this.isNewRecord = false;
        this.displayDialog = true;*/
      }

      nuevoConcepto() {
        this.isNewRecord = true;
        this.esModoVisualizacion = false;
        this.conceptoActual = {} as Concepto;

        // Inicializa el formulario con valores por defecto
        this.conceptoForm.reset({
          pla10empresacod: '00032', // O el código de empresa actual
          pla10conceptocod: this.conceptoService.GenerarNuevoCodigoConcepto(),
          pla10conceptodesc: '',
          pla10conceptoalias: '',
          pla10flagclase: '',
          pla10flagimpresion: '',
          pla10flagactivo: '',
          pla10flagconfigurable: '',
          pla10tipoconceptocod: '',
          pla10subtipoconceptocod: '',
          pla10tipocalculocod: '',
          pla10conceptosunatcod: '',
          pla10formula: '',
          pla10formulaalias: '',
          pla10comentario: '',
          pla10flagestandar: 'P',
          pla10conceptopadrecod: '',
          pla10flagestandardesc: 'Personalizado', // Como es Concepto solo debe insertar conceptos personalizados
          conceptotipodesc: '',
          conceptosubtipodesc: '',
          calculotipodesc: '',
          conceptosunatdesc: '',
          afectacionesSunat: [
                { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR TRABAJADOR', valor: false },
                { codigo: '04', descripcion: 'ESSALUD SCTR', valor: false },
                { codigo: '07', descripcion: 'SENATI', valor: false },
                { codigo: '08', descripcion: 'SISTEMA NACIONAL DE PENSIONES 19990', valor: false },
                { codigo: '09', descripcion: 'SISTEMA PRIVADO DE PENSIONES', valor: false },
                { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA RETENCIONES', valor: false },
                { codigo: '15', descripcion: 'FONDO COMPLEMENTARIO DE JUBILACIÓN MINERA', valor: false }
          ],
          afectacionOtros: [
                { codigo: '13', descripcion: 'SEGURO VIDA LEY', valor: false },
                { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', valor: false },
                { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', valor: false },
                { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', valor: false },
                { codigo: '20', descripcion: 'INGRESOS VARIABLES PROMEDIO (VAC,GRA,CTS,5TA PROYECCION)', valor: false },
                { codigo: '21', descripcion: 'INGRESOS EXTRAORDINARIOS PARA 5TA CATEGORIA', valor: false }
          ],
          planillasAsignadas: [
                { codigo: '01', descripcion: 'Planilla Mensual', valor: false },
                { codigo: '02', descripcion: 'Planilla Vacaciones', valor: false },
                { codigo: '16', descripcion: 'Planilla Gratificaciones ley', valor: false },
                { codigo: '05', descripcion: 'Planilla Liquidaciones', valor: false },
                { codigo: '04', descripcion: 'Planilla Utilidades', valor: false },
                { codigo: '20', descripcion: 'Planilla Quincenal Adelanto', valor: false }
          ],
          regimenesLaborales: [
                { codigo: '01', descripcion: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728', valor: false },
                { codigo: '16', descripcion: 'MICROEMPRESA D. LEG. 1086 (1)', valor: false },
                { codigo: '17', descripcion: 'PEQUEÑA EMPRESA D. LEG. 1086 (1)', valor: false },
                { codigo: '18', descripcion: 'AGRARIO LEY 27360', valor: false },
                { codigo: '20', descripcion: 'MINEROS', valor: false }
          ]
        });

        // Abre el modal de conceptos estándar
        this.abrirBusquedaConceptosEstandar();

      }

      crearConcepto() {
        if (this.conceptoForm.valid) {
          const raw = this.conceptoForm.value;
          const nuevoConcepto: Concepto = {
            ...raw,
            pla10flagclase: raw.pla10flagclase ? 'F' : 'C',
            pla10flagimpresion: raw.pla10flagimpresion ? 'S' : 'N',
            pla10flagactivo: raw.pla10flagactivo ? 'S' : 'N',
            pla10flagconfigurable: raw.pla10flagconfigurable ? 'S' : 'N',
            pla10flagestandar: raw.pla10flagestandar ? 'S' : 'N',
          };

          this.conceptoService.CrearConcepto(nuevoConcepto).subscribe({
            next: (resp) => {
              verMensajeInformativo(
                this.messageService,
                'success',
                'Éxito',
                resp.message || 'Concepto creado correctamente'
              );
              this.cargarConceptos();
              this.displayDialog = false;
            },
            error: (err) => {
              verMensajeInformativo(
                this.messageService,
                'error',
                'Error',
                err.message || 'No se pudo crear el concepto'
              );
            }
          });
        } else {
          verMensajeInformativo(
            this.messageService,
            'warn',
            'Advertencia',
            'Complete todos los campos requeridos'
          );
        }
      }

      guardarConcepto() {
        if (this.isNewRecord){
          this.crearConcepto();
        } else{

          if (this.conceptoForm.valid) {
            const raw = this.conceptoForm.value;
            // Mapea los flags booleanos a S/N o F/C
            const conceptoEditado: Concepto = {
              ...raw,
              pla10flagclase: raw.pla10flagclase ? 'F' : 'C',
              pla10flagimpresion: raw.pla10flagimpresion ? 'S' : 'N',
              pla10flagactivo: raw.pla10flagactivo ? 'S' : 'N',
              pla10flagconfigurable: raw.pla10flagconfigurable ? 'S' : 'N',
              pla10flagestandar: raw.pla10flagestandar ? 'S' : 'N',
            };

            this.conceptoService.ActualizarConcepto(conceptoEditado).subscribe({
              next: () => {
                verMensajeInformativo(
                  this.messageService,
                  'success',
                  'Éxito',
                  'Concepto actualizado'
                );
                this.cargarConceptos(); // Recarga la lista
                this.displayDialog = false;
              },
              error: (err) => {
                verMensajeInformativo(
                  this.messageService,
                  'error',
                  'Error',
                  `No se pudo guardar el concepto: ${err?.message || err?.error || err}`
                );
              }
            });
          } else {
            verMensajeInformativo(
              this.messageService,
              'warn',
              'Advertencia',
              'Complete todos los campos requeridos'
            );
          }
        }
      }

      eliminarConcepto(concepto: Concepto) {
      this.confirmationService.confirm({
        message: `¿Está seguro que desea eliminar el concepto <b>${concepto.pla10conceptodesc}</b>?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button',
        accept: () => {
          this.conceptoService
            .EliminarConcepto(concepto.pla10empresacod, concepto.pla10conceptocod)
            .subscribe({
              next: () => {
                this.cargarConceptos();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Concepto eliminado correctamente',
                });
              },
              error: () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo eliminar el registro',
                });
              },
            });
            },
          });
    }

      // Abrir búsqueda para Tipo de Cálculo
      abrirBusquedaTipoCalculo() {
        if (!this.esModoVisualizacion) {
          this.displayTipoCalculoDialog = true;
        }
      }

      // Abrir búsqueda para Tipo de Concepto
      abrirBusquedaConceptoTipo() {
        if (!this.esModoVisualizacion) {
          this.displayConceptoTipoDialog = true;
        }
      }

      // Abrir búsqueda para Sub Tipo de Concepto
      abrirBusquedaSubTipo() {
        if (!this.esModoVisualizacion) {
          this.displaySubTipoDialog = true;
        }
      }

      abrirBusquedaConceptoSunat() {
        if (!this.esModoVisualizacion) {
          this.displayConceptoSunatDialog = true;
        }
      }

      // Seleccionar de catálogos
      seleccionarTipoCalculo(tipo: TipoCalculo) {
        this.conceptoActual.pla10tipocalculocod = tipo.codigo;
        this.conceptoActual.calculotipodesc = tipo.descripcion;
        this.conceptoForm.patchValue({
          pla10tipocalculocod: tipo.codigo,
          calculotipodesc: tipo.descripcion
        })
        this.displayTipoCalculoDialog = false;
      }

      seleccionarConceptoTipo(tipo: ConceptoTipo) {
        this.conceptoActual.pla10tipoconceptocod = tipo.codigo;
        this.conceptoActual.conceptotipodesc = tipo.descripcion;
        this.conceptoForm.patchValue({
          pla10tipoconceptocod: tipo.codigo,
          conceptotipodesc: tipo.descripcion
        })
        this.displayConceptoTipoDialog = false;
      }

      seleccionarSubTipo(subTipo: SubTipoConcepto) {
        this.conceptoActual.pla10subtipoconceptocod = subTipo.codigo;
        this.conceptoActual.conceptosubtipodesc = subTipo.descripcion;
        this.conceptoForm.patchValue({
          pla10subtipoconceptocod: subTipo.codigo,
          conceptosubtipodesc: subTipo.descripcion
        })
        this.displaySubTipoDialog = false;
      }

      seleccionarConceptoSunat(concepto: ConceptoSunat) {
        this.conceptoActual.pla10conceptosunatcod = concepto.codigoSunat;
        this.conceptoActual.conceptosunatdesc = concepto.descripcion;
        this.conceptoForm.patchValue({
          pla10conceptosunatcod: concepto.codigoSunat,
          conceptosunatdesc: concepto.descripcion
        })
        this.displayConceptoSunatDialog = false;
      }


      // Buscar y seleccionar concepto estándar

      abrirBusquedaConceptosEstandar(): void {
        this.displayConceptosEstandarDialog = true;

        // Simulación de carga de datos (puedes reemplazar esto con un servicio)
        this.conceptosEstandar = [
          { codigo: '1006', descripcion: 'Remuneración Básica' },
          { codigo: '1011', descripcion: 'Asignación Familiar' },
          { codigo: '1019', descripcion: 'Rem Adicional Trab Nocturno' },
        ];
      }

      seleccionarConceptoEstandar(concepto: { codigo: string; descripcion: string }): void {
        this.conceptoForm.patchValue({
          pla10conceptopadrecod: concepto.codigo,
        });

        this.displayConceptosEstandarDialog = false; // Cierra el modal
        this.displayDialog = true; // Abre el detalle del concepto
      }


}
