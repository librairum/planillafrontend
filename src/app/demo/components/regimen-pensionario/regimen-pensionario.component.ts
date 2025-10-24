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
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

import { ConfirmationService, MessageService } from 'primeng/api';

import { RegimenPensionario } from '../../model/RegimenPensionario';

import { RegimenPensionarioService } from '../../service/regimen-pensionario.service'

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-regimen-pensionario',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CheckboxModule, DialogModule,
        CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule, DropdownModule],
  templateUrl: './regimen-pensionario.component.html',
  styleUrls: ['./regimen-pensionario.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class RegimenPensionarioComponent implements OnInit {



    regimenPensionarioForm: FormGroup = this.fb.group({}); //Quitar el = luego
        regimenPensionarioList: RegimenPensionario[] = []; //Quitar el = luego
        isEditing: boolean = false;
        editingRowIndex: number | null = null;
        editingRegimenPensionario: RegimenPensionario | null = null;
        editingRows: { [s: string]: boolean } = {};
        editingData: any = {};
        displayDialog: boolean = false;
        isNew: boolean = false;
        clonedRegimenPensionarios: { [s: string]: RegimenPensionario } = {}
        items: any[] = [];
        isEditingAnyRow: boolean = false;
        rowsPerPage: number = 10; // Numero de filas por página

        constructor(
            private regimenPensionarioService: RegimenPensionarioService,
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
            this.cargarRegimenesPensionarios()
        }



        initForm() {
            this.regimenPensionarioForm = this.fb.group({
                pla61codigo: ['', Validators.required],
                pla61descripcion: ['', Validators.required],
                pla61tiporegpensionariocod: ['', Validators.required],
                pla61flagsectorprivado: [false],
                pla61flagsectorpublico: [false],
                pla61afpnetcod: ['', Validators.required],
                pla61plamecod: ['', Validators.required],
                pla61flagactivo: [false]
            })
        }



        // cargar data
        cargarRegimenesPensionarios(): void {
          this.regimenPensionarioList = [
            {
                pla61codigo: '01',
                pla61descripcion: 'SIST NACIONAL DE PENSIONES DL 19990',
                pla61tiporegpensionariocod: 'SNP',
                pla61flagsectorprivado: 'S',
                pla61flagsectorpublico: 'S',
                pla61afpnetcod: '',
                pla61plamecod: '02',
                pla61flagactivo: 'S'
            },
            {
                pla61codigo: '02',
                pla61descripcion: 'INTEGRA',
                pla61tiporegpensionariocod: 'SPP',
                pla61flagsectorprivado: 'S',
                pla61flagsectorpublico: 'S',
                pla61afpnetcod: 'IN',
                pla61plamecod: '21',
                pla61flagactivo: 'S'
            }
          ]
          this.regimenPensionarioService.GetRegimenesPensionarios().subscribe({
                next: (data) => this.regimenPensionarioList = data,
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
        onRowEditInit(regimen: RegimenPensionario): void {
            this.editingRegimenPensionario = { ...regimen };
            this.isEditingAnyRow = true;
        }

        onRowEditSave(regimen: RegimenPensionario): void {
            if (this.editingRegimenPensionario) {
                const index = this.regimenPensionarioList.findIndex(r =>
                    r.pla61codigo === regimen.pla61codigo
                );

                if (index !== -1) {
                    this.regimenPensionarioList[index] = { ...regimen };

                    this.editingRegimenPensionario = null;
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


        onRowEditCancel(regimen: RegimenPensionario, index: number): void {
            if (this.editingRegimenPensionario) {
                this.regimenPensionarioList[index] = { ...this.editingRegimenPensionario };
                this.editingRegimenPensionario = null;
                this.isEditingAnyRow = false;
            }
        }


        //crear parametroxEmpresa
        showAddRow() {
            this.isEditing = true;
            this.isNew = true;
            this.regimenPensionarioForm.reset({

              pla61flagsectorprivado: false,
              pla61flagsectorpublico: false,
              pla61flagactivo: false

              /*
                pla41empresacod: this.globalService.getCodigoEmpresa(),
                */
            });
        }


        onSave() {
            if (this.regimenPensionarioForm.valid) {

                const raw = this.regimenPensionarioForm.value;
                //mapear booleanos a S/N
                const newRegimenPensionario: RegimenPensionario = {
                    ...raw,
                    pla61flagsectorprivado: raw.pla61flagsectorprivado ? 'S' : 'N',
                    pla61flagsectorpublico: raw.pla61flagsectorpublico ? 'S' : 'N',
                    pla61flagactivo: raw.pla61flagactivo ? 'S' : 'N'
                };

                // Verifica si ya existe el registro
                const existe = this.regimenPensionarioList.some(r =>
                    r.pla61codigo === newRegimenPensionario.pla61codigo
                );

                if (existe) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ya existe un registro con ese código'
                    });
                    return;
                }

                // Agrega el nuevo registro
                this.regimenPensionarioList.push(newRegimenPensionario);
                this.isEditing = false;
                this.isNew = false;
                this.regimenPensionarioForm.reset();

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
            this.regimenPensionarioForm.reset({

              /*
                ban01Empresa: this.globalService.getCodigoEmpresa(),
                */
            });
        }

        onDelete(regimen: RegimenPensionario, index: number) {
            this.confirmationService.confirm({
                message: `¿Está seguro que desea eliminar el régimen <b>${regimen.pla61descripcion}</b>?`,
                header: 'Confirmar Eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button',
                accept: () => {
                  this.regimenPensionarioList.splice(index, 1);
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

        // helper para togglear flags en la fila y mantener 'S'/'N'
        onToggleFlag(regimen: RegimenPensionario, field: 'pla61flagsectorprivado' | 'pla61flagsectorpublico' | 'pla61flagactivo', checked: boolean): void {
          regimen[field] = checked ? 'S' : 'N';
        }
}
