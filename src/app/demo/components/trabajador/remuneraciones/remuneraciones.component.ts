/* Milton Garriazo */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { Remuneracion } from 'src/app/demo/model/Trabajador';

import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-remuneraciones',
  templateUrl: './remuneraciones.component.html',
  styleUrls: ['./remuneraciones.component.css'],
  imports: [
    CommonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    CardModule,
    InputTextModule,
    PanelModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    TabViewModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class RemuneracionesComponent implements OnInit {
  @Input() remuneraciones!: FormArray; // Recibe el FormArray desde el componente padre
  @Input() esModoVisualizacion: boolean = false; // Estado de visualización
  @Output() save = new EventEmitter<void>(); // Emite evento al guardar
  @Output() cancel = new EventEmitter<void>(); // Emite evento al cancelar

  remuneracionesLista: Remuneracion[] = []; // Lista para mostrar en la tabla
  nuevaRemuneracionForm: FormGroup = this.fb.group({
    pla05conceptocod: [''],
    conceptodesc: [''],
    pla05importe: [0.0],
  });
  clonedRemuneraciones: { [key: string]: Remuneracion } = {};

  isEditing: boolean = false;
  editingRemuneracion: Remuneracion | null = null;
  isNew: boolean = false;
  isEditingAnyRow: boolean = false; // Indica si alguna fila está en edición

  // Modal para elegir codigo de concepto de regimen
  mostrarModalConceptoCod: boolean = false; // Controla la visibilidad del modal
  // Lista de tipos de regimenes pensionarios
  tiposConceptoCod: { codigo: string; descripcion: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.remuneracionesLista = this.getListaDesdeFormArray();
    console.log('Regímenes Pensionarios cargados:', this.remuneracionesLista);
  }

  getListaDesdeFormArray(): Remuneracion[] {
    return this.remuneraciones.value;
  }

  setFormArrayDesdeLista(lista: Remuneracion[]): void {
    this.remuneraciones.clear(); // Limpia el FormArray actual

    lista.forEach((remuneracion) => {
      this.remuneraciones.push(
        this.fb.group({
          pla05conceptocod: [remuneracion.pla05conceptocod],
          conceptodesc: [remuneracion.conceptodesc],
          pla05importe: [remuneracion.pla05importe],
        })
      );
    });
  }

  cargarTabla() {
    this.setFormArrayDesdeLista(this.remuneracionesLista);
  }

  onRowEditInit(remuneracion: Remuneracion, rowIndex: number): void {
    // Guardar los valores originales en clonedRegimenesPensionarios
      this.clonedRemuneraciones[rowIndex] = { ...remuneracion };

      // Establecer el estado de edición
      this.editingRemuneracion = { ...remuneracion };
      this.isEditingAnyRow = true;

      console.log('Edición iniciada. Valores originales guardados:', this.clonedRemuneraciones[rowIndex]);
  }

  onRowEditSave(rowIndex: number): void {
    const remuneracion = this.remuneraciones.at(rowIndex) as FormGroup;

    // Confirmar la acción antes de guardar
    this.confirmationService.confirm({
      message:
        '¿Está seguro que desea guardar los cambios en esta remuneración?',
      header: 'Confirmar Cambios',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Actualizar el FormArray y la lista en el índice correspondiente
        const remuneracionActualizada: Remuneracion = remuneracion.value;

        console.log('Valor actualizado:', remuneracionActualizada.pla05importe);

        // Actualizar el FormArray
        this.remuneraciones.at(rowIndex).patchValue(remuneracionActualizada);
        // Actualizar la lista
        this.setFormArrayDesdeLista(this.remuneracionesLista);

        // Eliminar el clon y desactivar el modo de edición
        delete this.clonedRemuneraciones[rowIndex];
        this.isEditingAnyRow = false;
        this.editingRemuneracion = null;

        // Habilitar todas las filas
        this.remuneraciones.controls.forEach((control) => control.enable());

        this.editingRemuneracion = null;
        this.isEditingAnyRow = false;

        // Mostrar mensaje de éxito
        verMensajeInformativo(
          this.messageService,
          'success',
          'Éxito',
          'Remuneración actualizada correctamente'
        );

        console.log(
          'Cambios guardados para la remuneración en la fila:',
          rowIndex
        );
        console.log('Datos actualizados:', remuneracion.value);
      },
      reject: () => {
        // Restaurar el estado de edición y habilitar las filas
        this.isEditingAnyRow = false;
        this.editingRemuneracion = null;

        // Habilitar todas las filas
        this.remuneraciones.controls.forEach((control) => control.enable());

        // Mostrar mensaje de cancelación
        verMensajeInformativo(
          this.messageService,
          'info',
          'Cancelado',
          'Los cambios no fueron guardados'
        );
      },
    });
  }

  onRowEditCancel(rowIndex: number): void {
    console.log('Cancelando edición. Valores originales:', this.clonedRemuneraciones[rowIndex]);

      const remuneracion = this.remuneraciones.at(rowIndex) as FormGroup;

      if (this.clonedRemuneraciones[rowIndex]) {
        // Restaurar los valores originales desde el clon
        remuneracion.setValue(this.clonedRemuneraciones[rowIndex]);

        // Restaurar los valores en la lista sincronizada
        this.remuneracionesLista[rowIndex] = { ...this.clonedRemuneraciones[rowIndex] };

        // Eliminar el clon
        delete this.clonedRemuneraciones[rowIndex];
      }

      // Restablecer el estado de edición
      this.isEditingAnyRow = false;
      this.editingRemuneracion = null;

      // Habilitar todas las filas
      this.remuneraciones.controls.forEach((control) => control.enable());

      console.log('Edición cancelada. Fila restaurada:', this.remuneraciones.at(rowIndex).value);
  }

  onDelete(remuneracion: Remuneracion, rowIndex: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar esta remuneración?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Eliminar del FormArray
        this.remuneraciones.removeAt(rowIndex);

        // Eliminar de la lista sincronizada
        if (rowIndex >= 0 && rowIndex < this.remuneracionesLista.length) {
          this.remuneracionesLista.splice(rowIndex, 1);
        } else {
          // Fallback por coincidencia de código si los índices no coinciden
          this.remuneracionesLista = this.remuneracionesLista.filter(
            (r) => r.pla05conceptocod !== remuneracion.pla05conceptocod
          );
        }

        verMensajeInformativo(
          this.messageService,
          'success',
          'Éxito',
          'Remuneración eliminada correctamente'
        );

        console.log('Remuneración eliminada: ', remuneracion);
      },
      reject: () => {
        verMensajeInformativo(
          this.messageService,
          'info',
          'Cancelado',
          'La eliminación de la remuneración fue cancelada'
        );
      },
    });
  }

  showAddRow() {
    // Inicializar el formulario para el nuevo período laboral

    this.nuevaRemuneracionForm.reset({
      pla05conceptocod: null,
      conceptodesc: [''],
      pla05importe: [0.0],
    });

    this.isEditing = true;
    this.isNew = true;
  }

  onSave() {
    if (this.nuevaRemuneracionForm.valid) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea guardar esta nueva remuneración?',
        header: 'Confirmar Remuneración',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          const nuevaRemuneracion: Remuneracion =
            this.nuevaRemuneracionForm.value;

          // Verificar si ya existe un régimen pensionario con el mismo código
          const existe = this.remuneracionesLista.some(
            (r) => r.pla05conceptocod === nuevaRemuneracion.pla05conceptocod
          );

          if (existe) {
            verMensajeInformativo(
              this.messageService,
              'error',
              'Error',
              'Ya existe una remuneración con ese código'
            );
            return;
          }

          // Agregar el nuevo período al FormArray
          this.remuneraciones.push(
            this.fb.group({
              pla05conceptocod: [nuevaRemuneracion.pla05conceptocod],
              conceptodesc: [nuevaRemuneracion.conceptodesc],
              pla05importe: [nuevaRemuneracion.pla05importe],
            })
          );

          // Actualizar la lista y limpiar el formulario
          this.remuneracionesLista = this.getListaDesdeFormArray();
          this.nuevaRemuneracionForm.reset();
          this.isEditing = false;
          this.isNew = false;
          verMensajeInformativo(
            this.messageService,
            'success',
            'Éxito',
            'Nueva remuneración guardada correctamente'
          );

          console.log('Nueva remuneración guardada:', nuevaRemuneracion);
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

  onCancel() {
    this.isEditing = false;
    this.isNew = false;
    this.nuevaRemuneracionForm.reset();

    this.remuneraciones.controls.forEach((control) => control.enable());
  }

  // Abrir el modal
  abrirModalTiposConceptoCod(): void {
    this.mostrarModalConceptoCod = true;

    // Cargar los motivos de cese (puedes reemplazar esto con datos reales)
    this.tiposConceptoCod = [
      {
        codigo: '0001',
        descripcion: 'Sueldo Mensual Básico',
      },
      {
        codigo: '0046',
        descripcion: 'Afecto Asignacion Familiar ( Si:1 / No:0 )',
      },
      {
        codigo: '0051',
        descripcion: 'Remuneracion Mensual Otra Empresa - 5ta cat'
      },
      {
        codigo: '0056',
        descripcion: 'Bono x Viaje',
      },
    ];
  }

  // Seleccionar un codigo de concepto
  seleccionarTipoConceptoCod(tipoconcepto: {
    codigo: string;
    descripcion: string;
  }) {
    if (this.isNew) {
      // Si se está creando un nuevo período, actualizar el formulario del nuevo período
      this.nuevaRemuneracionForm.patchValue({
        pla05conceptocod: tipoconcepto.codigo,
        conceptodesc: tipoconcepto.descripcion,
      });
    } else if (this.isEditingAnyRow && this.editingRemuneracion) {
      // Si se está editando un período existente, actualizar el FormArray y la lista
      const rowIndex = this.remuneracionesLista.findIndex(
        (r) => r.pla05conceptocod === this.editingRemuneracion?.pla05conceptocod
      );

      if (rowIndex !== -1) {
        const remuneracion = this.remuneraciones.at(rowIndex) as FormGroup;
        remuneracion.patchValue({
          pla05conceptocod: tipoconcepto.codigo,
          conceptodesc: tipoconcepto.descripcion,
        });

        // Actualizar la lista sincronizada
        this.remuneracionesLista[rowIndex].pla05conceptocod =
          tipoconcepto.codigo;
        this.remuneracionesLista[rowIndex].conceptodesc =
          tipoconcepto.descripcion;

        this.editingRemuneracion.pla05conceptocod = tipoconcepto.codigo;
        this.editingRemuneracion.conceptodesc = tipoconcepto.descripcion;
      }
    }

    // Cerrar el modal
    this.mostrarModalConceptoCod = false;
  }

  mostrarRemuneraciones(): void {
    console.log(this.remuneraciones.controls);
    console.log('FormArray:', this.remuneraciones.value);
    console.log('Lista:', this.remuneracionesLista);
  }
}
