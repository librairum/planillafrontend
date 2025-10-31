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
import { KeyFilterModule } from 'primeng/keyfilter';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ParametroxEmpresa } from '../../model/ParametroxEmpresa';

import { ParametroEmpresaService } from '../../service/parametro-empresa.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-parametros-empresa',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, KeyFilterModule,
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
        private parametroEmpresaService: ParametroEmpresaService,
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
      this.parametroEmpresaService.GetParametrosxEmpresa().subscribe({
                      next: (data) => this.parametroxEmpresaList = data,
                      error: (error) => {
                          verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar regimenes pensionarios');
                      }
                  });
    }

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
    onRowEditInit(parametro: ParametroxEmpresa): void {
        this.editingParametroxEmpresa = { ...parametro };
        this.isEditingAnyRow = true;
    }

    onRowEditSave(parametro: ParametroxEmpresa): void {
      if (this.editingParametroxEmpresa) {
                        this.parametroEmpresaService.ActualizarParametroxEmpresa(parametro).subscribe({
                            next: () => {
                                this.editingParametroxEmpresa = null;
                                this.isEditingAnyRow = false;
                                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro actualizado');
                            },
                            error: () => {
                                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al actualizar');
                            }
                        })
                    }
    }


    onRowEditCancel(parametro: ParametroxEmpresa, index: number): void {
        if (this.editingParametroxEmpresa) {
            this.parametroxEmpresaList[index] = { ...this.editingParametroxEmpresa };
            this.editingParametroxEmpresa = null;
            this.isEditingAnyRow = false;
            this.cargarParametrosxEmpresa();
        }
    }


    //crear parametroxEmpresa
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        //
        const nuevoCodigo = this.parametroEmpresaService.GenerarNuevoCodigoParametroEmpresa();
        this.parametroxEmpresaForm.reset({
          pla41codigo: nuevoCodigo
          /*
            pla41empresacod: this.globalService.getCodigoEmpresa(),
            */
        });
    }


    onSave() {
        if (this.parametroxEmpresaForm.valid) {
            this.confirmationService.confirm({
              message: '¿Está seguro que desea guardar este nuevo parámetro?',
                  header: 'Confirmar Parámetro',
                  icon: 'pi pi-question-circle',
                  acceptLabel: 'Sí',
                  rejectLabel: 'No',
                  acceptButtonStyleClass: 'p-button',
                  rejectButtonStyleClass: 'p-button-danger',
                  accept: () => {
                  const newParametroxEmpresa: ParametroxEmpresa = this.parametroxEmpresaForm.value;
                  this.parametroEmpresaService.CrearParametroxEmpresa(newParametroxEmpresa).subscribe({
                      next: () => {
                          this.isEditing = false;
                          this.isNew = false;
                          this.parametroxEmpresaForm.reset();
                          verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Parámetro guardado correctamente');
                          this.cargarParametrosxEmpresa();
                          console.log(newParametroxEmpresa);
                      },
                      error: (err) => {
                          console.error('Error al guardar:', err);
                          verMensajeInformativo(
                            this.messageService,
                            'error',
                            'Error',
                            'No se pudo guardar el parámetro'
                          );
                        },
                  });
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

    onCancel() {
        this.isEditing = false;
        this.isNew = false;
        this.parametroxEmpresaForm.reset({

          /*
            ban01Empresa: this.globalService.getCodigoEmpresa(),
            */
        });
    }

    onDelete(parametro: ParametroxEmpresa) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el parametro <b>${parametro.pla41descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
              this.parametroEmpresaService.EliminarParametroxEmpresa(
                  parametro.pla41empresacod,
                  parametro.pla41anio,
                  parametro.pla41codigo
              ).subscribe({
                  next: () => {
                      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro eliminado correctamente');
                      this.cargarParametrosxEmpresa();
                  },
                  error: () => {
                      verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudo eliminar el registro');
                  }
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
