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
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingConcepto: Concepto | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData: any = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    clonedConceptos: { [s: string]: Concepto } = {};
    items: any[] = [];
    isEditingAnyRow: boolean = false;
    rowsPerPage: number = 10; // Numero de filas por página

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
        pla10flagclase: [''],
        pla10flagimpresion: [''],
        pla10flagactivo: ['', Validators.required],
        pla10flagconfigurable: [''],
        pla10tipoconceptocod: [''],
        pla10subtipoconceptocod: [''],
        pla10tipocalculocod: [''],
        pla10conceptosunatcod: [''],
        pla10formula: [''],
        pla10formulaalias: [''],
        pla10comentario: [''],
        pla10flagestandar: ['', Validators.required],
        pla10conceptopadrecod: [''],

        conceptotipodesc: [''], //corresponde a la quinta columna del formulario escritorio
        conceptosubtipodesc: [''],
        calculotipodesc: [''],
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
            'Error al cargar regimenes pensionarios'
          );
        },
      });
    }

    /* Funcion para generar el texto del regimen pensionario  */

    getTipoDatoPlameDes(plame: string): string {
      if (plame === '02') {
        return 'DL 19990 - SIST NAC DE PENS - ONP';
      } else if (plame === '21') {
        return 'SPP INTEGRA';
      } else {
        return 'No definido';
      }
    }

    //edicion
    onRowEditInit(concepto: Concepto): void {
      this.editingConcepto = { ...concepto };
      this.isEditingAnyRow = true;
    }

    onRowEditSave(concepto: Concepto): void {
      if (this.editingConcepto) {
        this.conceptoService
          .ActualizarConcepto(concepto)
          .subscribe({
            next: () => {
              this.editingConcepto = null;
              this.isEditingAnyRow = false;
              verMensajeInformativo(
                this.messageService,
                'success',
                'Éxito',
                'Concepto actualizado'
              );
            },
            error: () => {
              verMensajeInformativo(
                this.messageService,
                'error',
                'Error',
                'Error al actualizar'
              );
            },
          });
      }
    }

    onRowEditCancel(concepto: Concepto, index: number): void {
      if (this.editingConcepto) {
        this.conceptoList[index] = {
          ...this.editingConcepto,
        };
        this.editingConcepto = null;
        this.isEditingAnyRow = false;
        this.cargarConceptos();
      }
    }

    //crear Concepto
    //esta para modificar esto
    showAddRow() {
      this.isEditing = true;
      this.isNew = true;
      const nuevoCodigo = this.conceptoService.GenerarNuevoCodigoConcepto();
      this.conceptoForm.reset({
        pla10conceptocod: nuevoCodigo

        /*
                  pla41empresacod: this.globalService.getCodigoEmpresa(),
                  */
      });
    }

    onSave() {
        if (this.conceptoForm.valid) {
          this.confirmationService.confirm({
            message: '¿Está seguro que desea guardar este nuevo concepto?',
            header: 'Confirmar Concepto',
            icon: 'pi pi-question-circle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
              const raw = this.conceptoForm.value;
              //mapear booleanos a S/N
              const newConcepto: Concepto = {
                ...raw,
              };

              this.conceptoService
              .CrearConcepto(newConcepto)
              .subscribe({
                next: () => {
                  this.isEditing = false;
                  this.isNew = false;
                  this.conceptoForm.reset();
                  verMensajeInformativo(
                    this.messageService,
                    'success',
                    'Éxito',
                    'Registro guardado'
                  );
                  this.cargarConceptos();
                },
                error: (err) => {
                  console.error('Error al guardar:', err);
                  verMensajeInformativo(
                    this.messageService,
                    'error',
                    'Error',
                    'No se pudo guardar el régimen'
                  );
                },
              });
            },
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


    onCancel() {
      this.isEditing = false;
      this.isNew = false;
      this.conceptoForm.reset({
        /*
                  ban01Empresa: this.globalService.getCodigoEmpresa(),
                  */
      });
    }

    onDelete(concepto: Concepto) {
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
            /*
                      this.bancoService.EliminarBanco(banco.ban01Empresa, banco.ban01IdBanco).subscribe({
                          next: () => {
                              this.bancoList.splice(index, 1);
                              verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro Eliminado');
                              this.cargarBancos()
                          }
                      })
                          */
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


      showDetalle(concepto: Concepto) {

        this.displayDialog = true;
      }

      // Mostrar ayuda sobre el concepto
      // Solo muestra un mensaje informativo como ejemplo
      mostrarAyuda(concepto: Concepto) {
        this.messageService.add({
          severity: 'info',
          summary: 'Ayuda del Concepto',
          detail: `Información sobre el concepto: ${concepto.pla10conceptodesc}`
        });
      }
}
