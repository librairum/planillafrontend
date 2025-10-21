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

import { ParametroxEmpresa } from '../../model/ParametroxEmpresa';

@Component({
  selector: 'app-parametros-empresa',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule,
        CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule, DropdownModule],
  templateUrl: './parametros-empresa.component.html',
  styleUrls: ['./parametros-empresa.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ParametrosEmpresaComponent implements OnInit {

    parametroxEmpresaForm: FormGroup = this.fb.group({}); //Quitar el = luego
    parametroxEmpresaList: ParametroxEmpresa[] = []; //Quitar el = luego
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingParametroxEmpresa: ParametroxEmpresa | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData: any = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    clonedParametrosxEmpresa: { [s: string]: ParametroxEmpresa } = {}
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
        this.cargarParametrosxEmpresa()
    }



    initForm() {
        this.parametroxEmpresaForm = this.fb.group({
            pla41empresacod: [''],
            pla41anio: [''],
            pla41codigo: ['', Validators.required],
            pla41descripcion: ['', Validators.required],
            pla41flagtipodato: ['', Validators.required],
            pla4101: ['', Validators.required],
            pla4102: ['', Validators.required],
            pla4103: ['', Validators.required],
            pla4104: ['', Validators.required],
            pla4105: ['', Validators.required],
            pla4106: ['', Validators.required],
            pla4107: ['', Validators.required],
            pla4108: ['', Validators.required],
            pla4109: ['', Validators.required],
            pla4110: ['', Validators.required],
            pla4111: ['', Validators.required],
            pla4112: ['', Validators.required],
            pla41flagestandar: ['']
        })
    }



    // cargar data
    cargarParametrosxEmpresa(): void {
      this.parametroxEmpresaList = [
        {
            pla41empresacod: '001',
            pla41anio: '2025',
            pla41codigo: '01',
            pla41descripcion: 'CUOTA SINDICAL',
            pla41flagtipodato: 'N',
            pla4101: 10,
            pla4102: 10,
            pla4103: 10,
            pla4104: 10,
            pla4105: 10,
            pla4106: 10,
            pla4107: 10,
            pla4108: 10,
            pla4109: 10,
            pla4110: 10,
            pla4111: 10,
            pla4112: 10,
            pla41flagestandar: 'S'
        },
        {
            pla41empresacod: '002',
            pla41anio: '2025',
            pla41codigo: '02',
            pla41descripcion: 'SCTR',
            pla41flagtipodato: 'N',
            pla4101: 10,
            pla4102: 10,
            pla4103: 10,
            pla4104: 10,
            pla4105: 10,
            pla4106: 10,
            pla4107: 10,
            pla4108: 10,
            pla4109: 10,
            pla4110: 10,
            pla4111: 10,
            pla4112: 10,
            pla41flagestandar: 'S'
        }
      ]
      /*this.bancoService.GetBancos().subscribe({
            next: (data) => this.bancoList = data,
            error: (error) => {
                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar bancos');
            }
        });*/
    }
    //edicion
    onRowEditInit(parametro: ParametroxEmpresa): void {
        this.editingParametroxEmpresa = { ...parametro };
        this.isEditingAnyRow = true;
    }

    onRowEditSave(parametro: ParametroxEmpresa): void {
        if (this.editingParametroxEmpresa) {
            const index = this.parametroxEmpresaList.findIndex(p =>
                p.pla41empresacod === parametro.pla41empresacod &&
                p.pla41codigo === parametro.pla41codigo
            );

            if (index !== -1) {
                this.parametroxEmpresaList[index] = { ...parametro };

                this.editingParametroxEmpresa = null;
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


    onRowEditCancel(parametro: ParametroxEmpresa, index: number): void {
        if (this.editingParametroxEmpresa) {
            this.parametroxEmpresaList[index] = { ...this.editingParametroxEmpresa };
            this.editingParametroxEmpresa = null;
            this.isEditingAnyRow = false;
        }
    }


    //crear parametroxEmpresa
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        this.parametroxEmpresaForm.reset({

          /*
            pla41empresacod: this.globalService.getCodigoEmpresa(),
            */
        });
    }


    onSave() {
        if (this.parametroxEmpresaForm.valid) {
            const newParametroxEmpresa: ParametroxEmpresa = this.parametroxEmpresaForm.value;
            // Verifica si ya existe el registro
            const existe = this.parametroxEmpresaList.some(p =>
                p.pla41empresacod === newParametroxEmpresa.pla41empresacod &&
                p.pla41codigo === newParametroxEmpresa.pla41codigo
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
            this.parametroxEmpresaList.push(newParametroxEmpresa);
            this.isEditing = false;
            this.isNew = false;
            this.parametroxEmpresaForm.reset();

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
        this.parametroxEmpresaForm.reset({

          /*
            ban01Empresa: this.globalService.getCodigoEmpresa(),
            */
        });
    }

    onDelete(parametro: ParametroxEmpresa, index: number) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el parametro <b>${parametro.pla41descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
              this.parametroxEmpresaList.splice(index, 1);
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
