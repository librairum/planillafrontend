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

import { ConfirmationService, Message, MessageService } from 'primeng/api';

import { PlantillaAsistencia } from '../../model/PlantillaAsistencia';



@Component({
  selector: 'app-plantilla-asistencia',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule,
        CardModule, InputTextModule, PanelModule, ConfirmDialogModule, FormsModule, DropdownModule],
  //template: `[(ngModel)]="plantillaAsistenciaForm"`,
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

    items: any[] = [];

    isNew: boolean = false;

    rowsPerPage: number = 10; // Numero de filas por página



    constructor(
      //agregar Servicio cuando sea implementado
      private fb: FormBuilder,
      private router: Router,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ){}

    ngOnInit(): void{
      this.initForm();
      this.cargarPlantillaAsistencia();
    }

    initForm() {
      this.plantillaAsistenciaForm = this.fb.group({
        pla20plantillacod: ['', Validators.required],
        pla20descripcion: ['', Validators.required],
        pla20flagmodifxusuario: ['', Validators.required],
        pla20flagregistrainasis: ['', Validators.required]
      });
    }

    cargarPlantillaAsistencia(): void {
      this.plantillaAsistenciaList = [
        { pla20plantillacod: '001', pla20descripcion: 'PLANILLA MENSUAL', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '002', pla20descripcion: 'PLANILLA VACACIONES', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '003', pla20descripcion: 'PLANILLA GRATIFICACIONES', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '004', pla20descripcion: 'PLANILLA LIQUIDACION', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '005', pla20descripcion: 'PLANILLA UTILIDAD', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '006', pla20descripcion: 'PLANILLA ADELANTO', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' }
      ];
    }

    // Edits
    onRowEditInit(plantilla: PlantillaAsistencia, index: number): void {
      this.editingPlantillaAsistencia = { ...plantilla };
      this.editingRowIndex = index;
    }

    onRowEditSave(plantilla: PlantillaAsistencia, index: number): void {
      if (this.editingPlantillaAsistencia && this.editingRowIndex === index) {
        this.plantillaAsistenciaList[index] = { ...plantilla };
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Plantilla de asistencia actualizada correctamente'
        });
        this.editingPlantillaAsistencia = null;
        this.editingRowIndex = null;
      }
    }

    onRowEditCancel(plantilla: PlantillaAsistencia, index: number): void {
      if (this.editingRowIndex === index) {
        this.editingPlantillaAsistencia = null;
        this.editingRowIndex = null;
        this.cargarPlantillaAsistencia();
      }
    }

    // Crear
    showAddRow(){
      this.isEditing = true;
      this.isNew = true;
      this.plantillaAsistenciaForm.reset({
        //implementar logica para obtener codigo nuevo
      });
    }

    // Guardar Creado

    onSave(){
      if (this.plantillaAsistenciaForm.valid) {
        const newPlantillaAsistencia: PlantillaAsistencia = {
          pla20plantillacod: this.plantillaAsistenciaForm.value.pla20plantillacod,
          pla20descripcion: this.plantillaAsistenciaForm.value.pla20descripcion,
          pla20flagmodifxusuario: this.plantillaAsistenciaForm.value.pla20flagmodifxusuario,
          pla20flagregistrainasis: this.plantillaAsistenciaForm.value.pla20flagregistrainasis
        }
        // Agregar la nueva plantilla a la lista
        this.plantillaAsistenciaList.push(newPlantillaAsistencia);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Plantilla de asistencia creada correctamente'
        });

        // Cerrar el formulario de creación
        this.isEditing = false;
        this.isNew = false;
        this.plantillaAsistenciaForm.reset();
      }
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

    onDelete(plantilla: PlantillaAsistencia, index: number){
      this.confirmationService.confirm({
        message: `¿Está seguro que desea eliminar la plantilla de asistencia <b>${plantilla.pla20descripcion}</b>?`,
              header: 'Confirmar Eliminación',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Sí',
              rejectLabel: 'No',
              acceptButtonStyleClass: 'p-button-danger',
              rejectButtonStyleClass: 'p-button',

              accept: () => {
                this.plantillaAsistenciaList.splice(index, 1);
                this.messageService.add({
                  severity:'success',
                  summary: 'Éxito',
                  detail: 'Plantilla de asistencia eliminada correctamente'
                });
              }
              /*accept: () => {
                  this.bancoService.EliminarBanco(banco.ban01Empresa, banco.ban01IdBanco).subscribe({
                      next: () => {
                          this.bancoList.splice(index, 1);
                          verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro Eliminado');
                          this.cargarBancos()
                      }
                  })
              }*/
      })
    }

}
