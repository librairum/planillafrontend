/* Milton Garriazo */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule, EditableRow } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from "primeng/toast";
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

import { ConfirmationService, Message, MessageService } from 'primeng/api';

import { PlantillaAsistencia } from '../../model/PlantillaAsistencia';
import { PlantillaAsistenciaDetalle } from '../../model/PlantillaAsistenciaDetalle';

import { PlantillaAsistenciaService } from '../../service/plantilla-asistencia.service';

import { verMensajeInformativo } from '../utilities/funciones_utilitarias';

@Component({
  selector: 'app-plantilla-asistencia',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, DialogModule, CheckboxModule,
        CardModule, InputTextModule, PanelModule, ConfirmDialogModule, FormsModule, DropdownModule],
  templateUrl: './plantilla-asistencia.component.html',
  styleUrls: ['./plantilla-asistencia.component.css'],
  providers: [MessageService, ConfirmationService, EditableRow]
})
export class PlantillaAsistenciaComponent implements OnInit {

    plantillaAsistenciaForm: FormGroup = this.fb.group({}); //Quitar el = luego

    plantillaAsistenciaList: PlantillaAsistencia[] = []; //Quitar el = luego

    isEditing: boolean = false;
    isEditingAnyRow: boolean = false;
    editingRowIndex: number | null = null;
    editingPlantillaAsistencia: PlantillaAsistencia | null = null;
    editingRows: { [key: number]: boolean } = {};
    editingData: any = {};

    // Modal
    showDetalleModal: boolean = false;
    selectedPlantilla: PlantillaAsistencia | null = null;
    plantillaDetalleList: PlantillaAsistenciaDetalle[] = [];

    items: any[] = [];

    isNew: boolean = false;

    rowsPerPage: number = 10; // Numero de filas por página

    //NOTA:
    //Para obtener el detalle de las plantillas de asistencia
    //se utiliza el metodo Spu_Pla_Trae_PlantillaDetalle
    //La cual devuelve SOLO los detalles que estan marcados en la plantilla

    constructor(
      private plantillaAsistenciaService: PlantillaAsistenciaService,
      private fb: FormBuilder,
      private router: Router,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ){}

    ngOnInit(): void{
      this.initForm();
      this.cargarPlantillaAsistencia();
      // construir mapa una sola vez
    }

    initForm() {
      this.plantillaAsistenciaForm = this.fb.group({
        pla20empresacod: '',
        pla20plantillacod: ['', Validators.required],
        pla20descripcion: ['', Validators.required],
        pla20flagmodifxusuario: [false],
        pla20flagregistrainasis: [false]
        //pla20flagmodifxusuario: ['', Validators.required],
        //pla20flagregistrainasis: ['', Validators.required]
      });
    }

    cargarPlantillaAsistencia(): void {
      this.plantillaAsistenciaService.GetPlantillasAsistencia().subscribe({
                            next: (data) => this.plantillaAsistenciaList = data,
                            error: (error) => {
                                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al cargar plantillas de asistencia');
                            }
                        });
    }

    // Edits
    onRowEditInit(plantilla: PlantillaAsistencia): void {
      this.editingPlantillaAsistencia = { ...plantilla };
      this.isEditingAnyRow = true;
    }

    onRowEditSave(plantilla: PlantillaAsistencia): void {
      if (this.editingPlantillaAsistencia) {
                        this.plantillaAsistenciaService.ActualizarPlantillaAsistencia(plantilla).subscribe({
                            next: () => {
                                this.editingPlantillaAsistencia = null;
                                this.isEditingAnyRow = false;
                                verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro actualizado');
                            },
                            error: () => {
                                verMensajeInformativo(this.messageService, 'error', 'Error', 'Error al actualizar');
                            }
                        })
                    }
    }

    onRowEditCancel(plantilla: PlantillaAsistencia, index: number): void {
      if (this.editingPlantillaAsistencia) {
        this.plantillaAsistenciaList[index] = { ...this.editingPlantillaAsistencia};
        this.editingPlantillaAsistencia = null;
        this.isEditingAnyRow = false;
        this.cargarPlantillaAsistencia();
      }
    }

    // Crear
    showAddRow(){
      this.isEditing = true;
      this.isNew = true;
      this.plantillaAsistenciaForm.reset({

        //CheckBoxes en false por defecto
        pla20flagmodifxusuario: false,
        pla20flagregistrainasis: false
        //implementar logica para obtener codigo nuevo
      });
    }

    // Guardar Creado

    onSave(){
      if (this.plantillaAsistenciaForm.valid) {
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
              } else {
                verMensajeInformativo(
                  this.messageService,
                  'warn',
                  'Advertencia',
                  'Complete todos los campos requeridos'
                );
              }
    }

    // helper para togglear flags en la fila y mantener 'S'/'N'
    onToggleFlag(plantilla: PlantillaAsistencia, field: 'pla20flagmodifxusuario' | 'pla20flagregistrainasis', checked: boolean): void {
      plantilla[field] = checked ? 'S' : 'N';
    }

    // Cancelar Creado

    onCancel(){
      this.isEditing = false;
      this.isNew = false;
      this.plantillaAsistenciaForm.reset({
        //implementar logica para obtener codigo del parametro
      });
    }

    //Eliminar

    onDelete(plantilla: PlantillaAsistencia){
      this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la plantilla <b>${plantilla.pla20descripcion}</b>?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        this.plantillaAsistenciaService
          .EliminarPlantillaAsistencia(plantilla.pla20empresacod, plantilla.pla20plantillacod)
          .subscribe({
            next: () => {
              this.cargarPlantillaAsistencia();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Registro eliminado correctamente',
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




    //cargar detalles
    cargarDetalle(pla20plantillacod: string, pla20empresacod: string): void {
      this.plantillaAsistenciaService.GetPlantillaAsistenciaDetalleList(pla20plantillacod, pla20empresacod)
        .subscribe({
          next: (detalles) => {
            this.plantillaDetalleList = detalles.map(det => ({ ...det }));
          },
          error: () => {
            this.plantillaDetalleList = [];
          }
        });
    }

    // llamado desde el botón "ver detalle"
    showDetalle(plantilla: PlantillaAsistencia): void {
      this.selectedPlantilla = plantilla;
      this.cargarDetalle(plantilla.pla20plantillacod, plantilla.pla20empresacod);
      this.showDetalleModal = true;
    }

    //cerrar
    closeDetalle(): void {
      this.showDetalleModal = false;
      this.selectedPlantilla = null;
      this.plantillaDetalleList = [];
    }

    //guardar estados de detalles

    guardarEstadosDetalle(): void {
      this.plantillaAsistenciaService.GuardarEstadosDetalle(this.plantillaDetalleList)
        .subscribe({
          next: () => {
            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Estados guardados correctamente');
          },
          error: () => {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudieron guardar los estados');
          }
        });
    }

}
 