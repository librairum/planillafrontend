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
import { CheckboxModule } from 'primeng/checkbox';

import { ConfirmationService, MessageService } from 'primeng/api';

import { SubTipoPlanilla } from '../../model/SubTipoPlanilla';

import { SubTipoPlantillaService } from '../../service/sub-tipo-plantilla.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-sub-tipo-planilla',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, KeyFilterModule, CheckboxModule,
        CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule, DropdownModule],
  templateUrl: './sub-tipo-planilla.component.html',
  styleUrls: ['./sub-tipo-planilla.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class SubTipoPlanillaComponent implements OnInit{

    subTipoPlanillaForm: FormGroup = this.fb.group({}); //Quitar el = luego
    subTipoPlanillaList: SubTipoPlanilla[] = []; //Quitar el = luego
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingSubTipoPlanilla: SubTipoPlanilla | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData: any = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    clonedSubTipoPlanilla: { [s: string]: SubTipoPlanilla } = {}
    items: any[] = [];
    isEditingAnyRow: boolean = false;
    rowsPerPage: number = 10; // Numero de filas por página

  constructor(
        private subTipoPlanillaService: SubTipoPlantillaService,
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
        this.cargarSubTipoPlanillas()
    }



    initForm() {
        this.subTipoPlanillaForm = this.fb.group({
            pla55empresacod: [''],
            pla55planillatipocod: [''],
            pla55codigo: ['', Validators.required],
            pla55descripcion: ['', Validators.required],
            pla55conceptoxdefault: ['', Validators.required],
            pla55flagactivo: [0, Validators.required],
            pla55plantillaasistenciacod: ['', Validators.required],
            pla55flagregulaaporteminessalud: [''],

            planillaTipoDes: [''],
            conceptoxdefaultDes: [''],
            plantillaAsistenciaDes: ['']
        })
    }



    // cargar data
    cargarSubTipoPlanillas(): void {
      this.subTipoPlanillaService.GetSubTipoPlanillas().subscribe({
                      next: (data) => {
                        this.subTipoPlanillaList = data; // SIN MAPEO
                      },
                      error: (error) => {
                          verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar subtipos de planilla');
                      }
                  });
    }

    //edicion
    onRowEditInit(planilla: SubTipoPlanilla): void {
        this.editingSubTipoPlanilla = { ...planilla };
        this.isEditingAnyRow = true;
    }

    onRowEditSave(planilla: SubTipoPlanilla): void {
      if (this.editingSubTipoPlanilla) {
                        // Convertir antes de enviar
                        const planillaToSend = {
                          ...planilla,
                          pla55flagactivo: planilla.pla55flagactivo === 1 ? 'S' : 'N'
                        } as any;
                        this.subTipoPlanillaService.ActualizarSubTipoPlanilla(planillaToSend).subscribe({
                            next: () => {
                                this.editingSubTipoPlanilla = null;
                                this.isEditingAnyRow = false;
                                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro actualizado');
                            },
                            error: () => {
                                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al actualizar');
                            }
                        })
                    }
    }


    onRowEditCancel(planilla: SubTipoPlanilla, index: number): void {
        if (this.editingSubTipoPlanilla) {
            this.subTipoPlanillaList[index] = { ...this.editingSubTipoPlanilla };
            this.editingSubTipoPlanilla = null;
            this.isEditingAnyRow = false;
            this.cargarSubTipoPlanillas();
        }
    }


    //crear subTipoPlanilla
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        //
        const nuevoCodigo = this.subTipoPlanillaService.GenerarNuevoCodigoPlanilla();
        this.subTipoPlanillaForm.reset({
          pla55codigo: nuevoCodigo,
          pla55flagactivo: 0
          /*
            pla41empresacod: this.globalService.getCodigoEmpresa(),
            */
        });
    }

    /*
    onSave(){
          if (this.plantillaAsistenciaForm.valid) {
            this.confirmationService.confirm({
              message: '¿Está seguro que desea guardar este nuevo registro?',
              header: 'Confirmar Registro',
              icon: 'pi pi-question-circle',
              acceptLabel: 'Sí',
              rejectLabel: 'No',
              acceptButtonStyleClass: 'p-button',
              rejectButtonStyleClass: 'p-button-danger',
              accept: () => {
                const raw = this.plantillaAsistenciaForm.value;
                //mapear booleanos a S/N
                const newPlantillaAsistencia: PlantillaAsistencia = {
                  ...raw,
                  pla20flagmodifxusuario: raw.pla20flagmodifxusuario ? 'S' : 'N',
                  pla20flagregistrainasis: raw.pla20flagregistrainasis ? 'S' : 'N',
                };

                this.plantillaAsistenciaService
                  .CrearPlantillaAsistencia(newPlantillaAsistencia)
                  .subscribe({
                    next: () => {
                      this.isEditing = false;
                      this.isNew = false;
                      this.plantillaAsistenciaForm.reset();
                      verMensajeInformativo(
                        this.messageService,
                        'success',
                        'Éxito',
                        'Registro guardado'
                      );
                      this.cargarPlantillaAsistencia();
                      //
                      console.log(newPlantillaAsistencia)
                    },
                    error: (err) => {
                      console.error('Error al guardar:', err);
                      verMensajeInformativo(
                        this.messageService,
                        'error',
                        'Error',
                        'No se pudo guardar el registro'
                      );
                    },
                  });
              }
              // No es necesario manejar el reject, simplemente no hace nada
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
    */


    onSave() {
        if (this.subTipoPlanillaForm.valid) {
            this.confirmationService.confirm({
              message: '¿Está seguro que desea guardar este nuevo registro?',
              header: 'Confirmar Registro',
              icon: 'pi pi-question-circle',
              acceptLabel: 'Sí',
              rejectLabel: 'No',
              acceptButtonStyleClass: 'p-button',
              rejectButtonStyleClass: 'p-button-danger',
              accept: () => {
                const raw = this.subTipoPlanillaForm.value;
                const newSubTipoPlanilla: SubTipoPlanilla = {
                    ...raw,
                    //pla55flagactivo: raw.pla55flagactivo === 1 ? 'S' : 'N'
                } as any;
                this.subTipoPlanillaService.CrearSubTipoPlanilla(newSubTipoPlanilla).subscribe({
                    next: () => {
                        this.isEditing = false;
                        this.isNew = false;
                        this.subTipoPlanillaForm.reset();
                        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro guardado correctamente');
                        this.cargarSubTipoPlanillas();
                        console.log(newSubTipoPlanilla);
                    },
                    error: (err) => {
                      console.error('Error al guardar:', err);
                      verMensajeInformativo(
                        this.messageService,
                        'error',
                        'Error',
                        'No se pudo guardar el registro'
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
        this.subTipoPlanillaForm.reset({

          /*
            ban01Empresa: this.globalService.getCodigoEmpresa(),
            */
        });
    }

    onDelete(planilla: SubTipoPlanilla) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar la planilla <b>${planilla.pla55descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
              this.subTipoPlanillaService.EliminarSubTipoPlanilla(
                  planilla.pla55empresacod,
                  planilla.pla55planillatipocod,
                  planilla.pla55codigo
              ).subscribe({
                  next: () => {
                      verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro eliminado correctamente');
                      this.cargarSubTipoPlanillas();
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

    // helper para togglear flags en la fila y mantener 1/0
        onToggleFlag(plantilla: SubTipoPlanilla, field: 'pla55flagactivo', checked: boolean): void {
          plantilla[field] = checked ? 1 : 0;
        }
}
