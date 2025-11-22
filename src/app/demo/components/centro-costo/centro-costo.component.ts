import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { CentroCosto } from 'src/app/demo/model/Empresa';
import {
  verMensajeInformativo,
  esVacio,
  aMayusculas
} from 'src/app/demo/components/utilities/funciones_utilitarias';

@Component({
  selector: 'app-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CheckboxModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    DropdownModule,
    RippleModule,
    TableModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './centro-costo.component.html',
  styleUrls: ['./centro-costo.component.css']
})

export class CentroCostoComponent implements OnInit {

  centroCosto: CentroCosto = this.initializeCentroCosto();
  currentCodigo: string = '';

  // Lista de centros de costo para la tabla
  centrosCosto: CentroCosto[] = [];
  rowsPerPage: number = 10;

  // Modos de edición
  isAddMode: boolean = false;
  isEditMode: boolean = false;

  editingCentroCosto: CentroCosto | null = null;


  currentCentrosCosto: CentroCosto[] = [
    {
      pla57codigo: '000',
      pla57descripcion: 'Por defecto',
      pla57flagactivo: false
    },
    {
      pla57codigo: '001',
      pla57descripcion: 'Por defecto',
      pla57flagactivo: false
    },
  ];

  selectedCentroCosto: CentroCosto | null = null;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // Carga inicial de datos simulados
    this.centrosCosto = JSON.parse(JSON.stringify(this.currentCentrosCosto));
  }

  private initializeCentroCosto(): CentroCosto {
    return {
      pla57codigo: '',
      pla57descripcion: '',
      pla57flagactivo: false,
    };
  }

  // --- Métodos de Control de UI ---

  agregarCentroCosto(): void {
    // Generamos un ID temporal único
    const tempId = `${Date.now()}`;

    const newCentroCosto: CentroCosto = {
      ...this.initializeCentroCosto(),
      // Usamos el ID temporal
      pla57codigo: tempId
    };

    this.centrosCosto.push(newCentroCosto);

    this.editingCentroCosto = JSON.parse(JSON.stringify(newCentroCosto));

    this.isAddMode = true;
    this.isEditMode = false;

    this.centroCosto = this.initializeCentroCosto();
    this.selectedCentroCosto = null;
  }

  cancelar(): void {
    // Cancela el modo de Adición 
    this.isAddMode = false;
    this.isEditMode = false;

    this.centroCosto = this.initializeCentroCosto();
    this.selectedCentroCosto = null;
  }


  onRowEditarCentroCosto(centroCosto: CentroCosto): void {
    // Clonamos profundamente el objeto para evitar modificar la tabla directamente
    this.editingCentroCosto = JSON.parse(JSON.stringify(centroCosto));

    this.isEditMode = true;
    this.isAddMode = false;
  }

  onRowCancelarEdicion(centroCosto: CentroCosto): void {
    if (this.isAddMode) {
      this.centrosCosto = this.centrosCosto.filter(e => e.pla57codigo !== centroCosto.pla57codigo);
    }

    this.editingCentroCosto = null;
    this.isEditMode = false;
    this.isAddMode = false;

    this.centrosCosto = JSON.parse(JSON.stringify(this.currentCentrosCosto));
  }

  onRowValidarCampos(centroCosto: CentroCosto): boolean {

    if (this.isAddMode) {
      if (esVacio(centroCosto.pla57codigo)) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código es obligatorio para el nuevo registro.');
        return false;
      }

      if (this.currentCentrosCosto.some(e => e.pla57codigo.toUpperCase() === centroCosto.pla57codigo.toUpperCase())) {
        verMensajeInformativo(this.messageService, 'error', 'Error', `El Código ${centroCosto.pla57codigo} ya existe.`);
        return false;
      }
    }

    if (esVacio(centroCosto.pla57descripcion)) {
      verMensajeInformativo(this.messageService, 'error', 'Error', 'La descripción es obligatoria.');
      return false;
    }

    return true;
  }

  onRowGuardarEdicion(original: CentroCosto): void {
    const edited = this.editingCentroCosto;
    if (!edited) return;

    if (!this.onRowValidarCampos(edited)) {
      return;
    }

    // Estandarización y consistencia
    edited.pla57descripcion = aMayusculas(edited.pla57descripcion);
    edited.pla57codigo = edited.pla57codigo.toUpperCase();

    let mensajeExito = '';

    if (this.isAddMode) {
      this.centrosCosto = this.centrosCosto.filter(e => e.pla57codigo !== original.pla57codigo);

      // 2. Agregar el nuevo establecimiento guardado al array principal de datos
      this.currentCentrosCosto.push(JSON.parse(JSON.stringify(edited)));
      mensajeExito = 'Establecimiento agregado exitosamente';

    } else {

      const index = this.currentCentrosCosto.findIndex(e => e.pla57codigo === original.pla57codigo);

      if (index > -1) {
        this.currentCentrosCosto[index] = JSON.parse(JSON.stringify(edited));
        mensajeExito = 'Cambios guardados exitosamente';
      } else {
        //verMensajeInformativo(this.messageService, 'error', 'Error', 'No se encontró el registro original para actualizar.');

        this.centrosCosto = JSON.parse(JSON.stringify(this.currentCentrosCosto));
        this.onRowCancelarEdicion(original);
        return;
      }
    }

    this.centrosCosto = JSON.parse(JSON.stringify(this.currentCentrosCosto));

    verMensajeInformativo(this.messageService, 'success', 'Éxito', mensajeExito);

    this.editingCentroCosto= null;
    this.isEditMode = false;
    this.isAddMode = false;
  }

  eliminarCentroCosto(centroCosto: CentroCosto): void {

    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el centro de costo con código ${centroCosto.pla57codigo}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',

      accept: () => {
        const codigoAeliminar = centroCosto.pla57codigo;
        const initialLength = this.currentCentrosCosto.length;

        this.currentCentrosCosto = this.currentCentrosCosto.filter(e => e.pla57codigo !== codigoAeliminar);

        if (this.currentCentrosCosto.length < initialLength) {
          this.centrosCosto = JSON.parse(JSON.stringify(this.currentCentrosCosto));
          verMensajeInformativo(this.messageService, 'success', 'Éxito', `Centro de costo ${codigoAeliminar} eliminado.`);
        } else {
          verMensajeInformativo(this.messageService, 'error', 'Error', `No se encontró el cargo ${codigoAeliminar} para eliminar.`);
        }
      }
    });
  }
}
