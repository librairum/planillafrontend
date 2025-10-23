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
        //private bancoService: BancoService,
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
      this.parametroGeneralList = [
        {
            pla40anio: '2025',
            pla40codigo: '01',
            pla40descripcion: 'REMUNERACION MINIMA VITAL',
            pla40flagtipodato: 'I',
            pla4001: 1130.00,
            pla4002: 1130.00,
            pla4003: 1130.00,
            pla4004: 1130.00,
            pla4005: 1130.00,
            pla4006: 1130.00,
            pla4007: 1130.00,
            pla4008: 1130.00,
            pla4009: 1130.00,
            pla4010: 1130.00,
            pla4011: 1130.00,
            pla4012: 1130.00
        },
        {
            pla40anio: '2025',
            pla40codigo: '03',
            pla40descripcion: 'APORTE SENATI',
            pla40flagtipodato: 'P',
            pla4001: 0.75,
            pla4002: 0.75,
            pla4003: 0.75,
            pla4004: 0.75,
            pla4005: 0.75,
            pla4006: 0.75,
            pla4007: 0.75,
            pla4008: 0.75,
            pla4009: 0.75,
            pla4010: 0.75,
            pla4011: 0.75,
            pla4012: 0.75
        }
      ]
      /*this.bancoService.GetBancos().subscribe({
            next: (data) => this.bancoList = data,
            error: (error) => {
                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar bancos');
            }
        });*/
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
            const index = this.parametroGeneralList.findIndex(p =>
                p.pla40anio === parametro.pla40anio &&
                p.pla40codigo === parametro.pla40codigo
            );

            if (index !== -1) {
                this.parametroGeneralList[index] = { ...parametro };

                this.editingParametroGeneral = null;
                this.isEditingAnyRow = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Registro actualizado correctamente'
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo encontrar el registro para actualizar'
                });
            }

            /*this.bancoService.ActualizarBanco(banco).subscribe({
                next: () => {
                    this.editingBanco = null;
                    this.isEditingAnyRow = false;
                    verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro actualizado');
                },
                error: () => {
                    verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al actualizar');
                }
            })*/
        }
    }


    onRowEditCancel(parametro: ParametroGeneral, index: number): void {
        if (this.editingParametroGeneral) {
            this.parametroGeneralList[index] = { ...this.editingParametroGeneral };
            this.editingParametroGeneral = null;
            this.isEditingAnyRow = false;
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
            // Verifica si ya existe el registro
            const existe = this.parametroGeneralList.some(p =>
                p.pla40anio === newParametroGeneral.pla40anio &&
                p.pla40codigo === newParametroGeneral.pla40codigo
            );

            if (existe) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ya existe un registro con ese código y empresa'
                });
                return;
            }

            // Agrega el nuevo registro
            this.parametroGeneralList.push(newParametroGeneral);
            this.isEditing = false;
            this.isNew = false;
            this.parametroGeneralForm.reset();

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Registro guardado correctamente'
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Complete todos los campos requeridos'
            });
            /*
            this.parametroxEmpresaService.CrearParametroxEmpresa(newParametroxEmpresa).subscribe({
                next: () => {
                    this.isEditing = false;
                    this.isNew = false;
                    this.bancoForm.reset();
                    verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro guardado');
                    this.cargarBancos();
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudo guardar el registro');
                },
            })*/
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
              this.parametroGeneralList.splice(index, 1);
              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Registro eliminado correctamente'
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
        })
    }
}
