/* Milton Garriazo */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';


import { ConfirmationService, MessageService } from 'primeng/api';

import { ParametroGeneral } from '../../model/ParametroGeneral';

import { ParametroGeneralService } from '../../service/parametro-general.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-parametros-general',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule,
        CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule, DropdownModule],
  templateUrl: './parametros-general.component.html',
  styleUrls: ['./parametros-general.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ParametrosGeneralComponent implements OnInit {

    parametroGeneralForm: FormGroup = this.fb.group({}); //Quitar el = luego
    parametroGeneralList: ParametroGeneral[] = []; //Quitar el = luego
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingParametroGeneral: ParametroGeneral | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData: any = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    clonedParametrosGenerales: { [s: string]: ParametroGeneral } = {}
    items: any[] = [];
    isEditingAnyRow: boolean = false;
    rowsPerPage: number = 10; // Numero de filas por página

    constructor(
        private parametroGeneralService: ParametroGeneralService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        //private bS: BreadcrumbService,
        private router: Router,
        //private globalService: GlobalService,
        private messageService: MessageService
      ) {

    }


    ngOnInit(): void {
        /*this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Bancos', routerLink: '/Home/banco' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })*/
        this.initForm()
        this.cargarParametrosGenerales()
    }



    initForm() {
        this.parametroGeneralForm = this.fb.group({
            pla40anio: [''],
            pla40codigo: ['', Validators.required],
            pla40descripcion: ['', Validators.required],
            pla40flagtipodato: ['', Validators.required],
            pla4001: ['', Validators.required],
            pla4002: ['', Validators.required],
            pla4003: ['', Validators.required],
            pla4004: ['', Validators.required],
            pla4005: ['', Validators.required],
            pla4006: ['', Validators.required],
            pla4007: ['', Validators.required],
            pla4008: ['', Validators.required],
            pla4009: ['', Validators.required],
            pla4010: ['', Validators.required],
            pla4011: ['', Validators.required],
            pla4012: ['', Validators.required]
        })
    }



    // cargar data
    cargarParametrosGenerales(): void {
      this.parametroGeneralService.GetParametrosGenerales().subscribe({
                      next: (data) => this.parametroGeneralList = data,
                      error: (error) => {
                          verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar regimenes pensionarios');
                      }
                  });
    }

    /* Funcion para generar texto segun tipo de dato */

    getTipoDatoTexto(flag: string): string {
    if (flag === 'I') {
        return 'Importe';
    } else if (flag === 'P') {
        return 'Porcentaje';
    } else {
        return 'No definido';
    }
}

    //edicion
    onRowEditInit(parametro: ParametroGeneral): void {
        this.editingParametroGeneral = { ...parametro };
        this.isEditingAnyRow = true;
    }

    onRowEditSave(parametro: ParametroGeneral): void {
        if (this.editingParametroGeneral) {
                        this.parametroGeneralService.ActualizarParametroGeneral(parametro).subscribe({
                            next: () => {
                                this.editingParametroGeneral = null;
                                this.isEditingAnyRow = false;
                                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro actualizado');
                            },
                            error: () => {
                                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al actualizar');
                            }
                        })
                    }
    }


    onRowEditCancel(parametro: ParametroGeneral, index: number): void {
        if (this.editingParametroGeneral) {
            this.parametroGeneralList[index] = { ...this.editingParametroGeneral };
            this.editingParametroGeneral = null;
            this.isEditingAnyRow = false;
            this.cargarParametrosGenerales();
        }
    }


    //crear parametroxEmpresa
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        this.parametroGeneralForm.reset({

          /*
            pla41empresacod: this.globalService.getCodigoEmpresa(),
            */
        });
    }


    onSave() {
        if (this.parametroGeneralForm.valid) {
                    const newParametroGeneral: ParametroGeneral = this.parametroGeneralForm.value;
                    this.parametroGeneralService.CrearParametroGeneral(newParametroGeneral).subscribe({
                        next: () => {
                            this.isEditing = false;
                            this.isNew = false;
                            this.parametroGeneralForm.reset();
                            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro guardado correctamente');
                            this.cargarParametrosGenerales();
                        },
                        error: (err) => {
                            verMensajeInformativo(this.messageService, 'error', 'Error', err.message || 'Ya existe un registro con ese código y empresa');
                        }
                    });
                } else {
                    verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Complete todos los campos requeridos');
                }
    }

    onCancel() {
        this.isEditing = false;
        this.isNew = false;
        this.parametroGeneralForm.reset({

          /*
            ban01Empresa: this.globalService.getCodigoEmpresa(),
            */
        });
    }

    onDelete(parametro: ParametroGeneral, index: number) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el parametro <b>${parametro.pla40descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
              this.parametroGeneralService.EliminarParametroGeneral(
                  parametro.pla40anio,
                  parametro.pla40codigo
              ).subscribe({
                  next: () => {
                      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro eliminado correctamente');
                      this.cargarParametrosGenerales();
                  },
                  error: () => {
                      verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudo eliminar el registro');
                  }
              });
            }
        })
    }
}  
