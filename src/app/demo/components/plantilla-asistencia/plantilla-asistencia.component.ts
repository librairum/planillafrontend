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
      //agregar Servicio cuando sea implementado
      private fb: FormBuilder,
      private router: Router,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ){}

    ngOnInit(): void{
      this.initForm();
      this.cargarPlantillaAsistencia();
      // construir mapa una sola vez
      this.buildDetalleMap(); //borrar esto despues de implementar el servicio
    }

    initForm() {
      this.plantillaAsistenciaForm = this.fb.group({
        pla20plantillacod: ['', Validators.required],
        pla20descripcion: ['', Validators.required],
        pla20flagmodifxusuario: [false],
        pla20flagregistrainasis: [false]
        //pla20flagmodifxusuario: ['', Validators.required],
        //pla20flagregistrainasis: ['', Validators.required]
      });
    }

    cargarPlantillaAsistencia(): void {
      this.plantillaAsistenciaList = [
        { pla20plantillacod: '001', pla20descripcion: 'PLANILLA MENSUAL', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '002', pla20descripcion: 'PLANILLA VACACIONES', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '003', pla20descripcion: 'PLANILLA GRATIFICACIONES', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '004', pla20descripcion: 'PLANILLA LIQUIDACION', pla20flagmodifxusuario: 'S', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '005', pla20descripcion: 'PLANILLA UTILIDAD', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' },
        { pla20plantillacod: '006', pla20descripcion: 'PLANILLA ADELANTO', pla20flagmodifxusuario: 'N', pla20flagregistrainasis: 'N' }
      ];
    }

    // Edits
    onRowEditInit(plantilla: PlantillaAsistencia): void {
      this.editingPlantillaAsistencia = { ...plantilla };
      this.isEditingAnyRow = true;
    }

    onRowEditSave(plantilla: PlantillaAsistencia): void {
      if (this.editingPlantillaAsistencia) {
        const index = this.plantillaAsistenciaList.findIndex(p=>
          p.pla20plantillacod === plantilla.pla20plantillacod
        )

        if (index !== -1){
          this.plantillaAsistenciaList[index] = { ...plantilla };

          this.editingPlantillaAsistencia = null;
          this.isEditingAnyRow = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plantilla de asistencia actualizada correctamente'
          });
        } else{
          this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo encontrar el registro para actualizar'
                });
        }
      }
    }

    onRowEditCancel(plantilla: PlantillaAsistencia, index: number): void {
      if (this.editingPlantillaAsistencia) {
        this.plantillaAsistenciaList[index] = { ...this.editingPlantillaAsistencia};
        this.editingPlantillaAsistencia = null;
        this.isEditingAnyRow = false;
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
        //Mapear booleanos S/N
        const newPlantillaAsistencia: PlantillaAsistencia = {
          ...raw,
          pla20flagmodifxusuario: raw.pla20flagmodifxusuario ? 'S' : 'N',
          pla20flagregistrainasis: raw.pla20flagregistrainasis ? 'S' : 'N'
        };

        const existe = this.plantillaAsistenciaList.some(p =>
          p.pla20plantillacod === newPlantillaAsistencia.pla20plantillacod
        )

        if (existe){
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ya existe una plantilla con el mismo código'
          });
          return;
        }

        // Agregar la nueva plantilla a la lista
        this.plantillaAsistenciaList.push(newPlantillaAsistencia);
        this.isEditing = false;
        this.isNew = false;
        this.plantillaAsistenciaForm.reset();

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Plantilla de asistencia creada correctamente'
        });
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, complete todos los campos requeridos'
        });
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

    // Mock data centralizado para detalles (mejor organizar aquí)
    //Borrar luego
    mockDetalleData: PlantillaAsistenciaDetalle[] = [
      // details for plantilla 001
      { pla21empresacod:'00032', pla21plantillacod:'001', pla21correlativo: 1, pla21camponombre:'Pla01CampoA', pla21campoalias:'Campo A'},
      { pla21empresacod:'00032', pla21plantillacod:'001', pla21correlativo: 2, pla21camponombre:'Pla01CampoB', pla21campoalias:'Campo B'},

      // details for plantilla 002
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 1, pla21camponombre:'Pla02VacacionesFisicas', pla21campoalias:'Dias Fisicos'},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 2, pla21camponombre:'Pla02VacacionesVendidas', pla21campoalias:'Dias Vendidas'},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 3, pla21camponombre:'Pla02VacaFechaIni', pla21campoalias:'Fecha Inicio'},
      { pla21empresacod:'00032', pla21plantillacod:'002', pla21correlativo: 4, pla21camponombre:'Pla02VacaFechaFin', pla21campoalias:'Fecha Fin'},

      // details for plantilla 003
      { pla21empresacod:'00032', pla21plantillacod:'003', pla21correlativo: 1, pla21camponombre:'Pla03CampoA', pla21campoalias:'Campo A'},
      { pla21empresacod:'00032', pla21plantillacod:'003', pla21correlativo: 2, pla21camponombre:'Pla03CampoB', pla21campoalias:'Campo B'},

      // other empresas / ejemplos
      { pla21empresacod:'00032', pla21plantillacod:'004', pla21correlativo: 1, pla21camponombre:'Pla04CampoA', pla21campoalias:'Campo A'}
    ];

    // Mapa indexado por pla21plantillacod para acceso rápido
    detalleMap: { [plantillaCod: string]: PlantillaAsistenciaDetalle[] } = {};

    // Construye el índice/mapa desde el arreglo mock
    buildDetalleMap(): void {
      this.detalleMap = {};
      for (const d of this.mockDetalleData) {
        if (!this.detalleMap[d.pla21plantillacod]) {
          this.detalleMap[d.pla21plantillacod] = [];
        }
        this.detalleMap[d.pla21plantillacod].push(d);
      }
    }


    //cargar detalles
    cargarDetalle(pla20plantillacod: string, pla20empresacod?: string): void {
      const all = this.detalleMap[pla20plantillacod] ?? [];
      if (pla20empresacod) {
        this.plantillaDetalleList = all.filter(x => x.pla21empresacod === pla20empresacod);
      } else {
        this.plantillaDetalleList = [...all]; // copia para evitar mutaciones accidentales
      }
    }

    // llamado desde el botón "ver detalle"
    showDetalle(plantilla: PlantillaAsistencia): void {
      this.selectedPlantilla = plantilla;
      this.cargarDetalle(plantilla.pla20plantillacod);
      this.showDetalleModal = true;
    }

    //cerrar
    closeDetalle(): void {
      this.showDetalleModal = false;
      this.selectedPlantilla = null;
      this.plantillaDetalleList = [];
    }

}
