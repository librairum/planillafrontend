/* Milton Garriazo */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, AbstractControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

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

import { RegimenPensionario } from 'src/app/demo/model/Trabajador';

import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-regimenes-pensionarios',
  templateUrl: './regimenes-pensionarios.component.html',
  styleUrls: ['./regimenes-pensionarios.component.css'],
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
export class RegimenesPensionariosComponent implements OnInit {
    @Input() regimenespensionarios!: FormArray; // Recibe el FormArray desde el componente padre
    @Input() esModoVisualizacion: boolean = false; // Estado de visualización
    @Output() save = new EventEmitter<void>(); // Emite evento al guardar
    @Output() cancel = new EventEmitter<void>(); // Emite evento al cancelar

    regimenesPensionariosLista: RegimenPensionario[] = []; // Lista para interactuar con PrimeNG
    nuevoRegimenForm: FormGroup = this.fb.group({
      pla31regpensionariocod: [''],
      desregpensionario: [''],
      pla31regpensionariocupss: [''],
      pla31fechaini: [null],
      pla31fechafin: [null],
      pla31flagcomisionmixta: ['']
    });


    clonedRegimenesPensionarios: { [key: number]: any } = {}; // Clona los datos originales de las filas

    isEditing: boolean = false;
    editingRegimenPensionario: RegimenPensionario | null = null;
    isNew: boolean = false;
    isEditingAnyRow: boolean = false; // Indica si alguna fila está en edición

    // Modal para elegir codigo de regimen pensionario
    mostrarModalRegimenPensionario: boolean = false; // Controla la visibilidad del modal

    // Lista de tipos de regimenes pensionarios
    tiposRegimenesPensionarios: { codigo: string; descripcion: string, clase: string, afpcod: string }[] = [];

    constructor(
      private fb: FormBuilder,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ) {}


    ngOnInit(): void {
        this.regimenesPensionariosLista = this.getListaDesdeFormArray();
    }


    getListaDesdeFormArray(): RegimenPensionario[] {
      return this.regimenespensionarios.value; // Devuelve los valores del FormArray como un array
    }


    setFormArrayDesdeLista(lista: RegimenPensionario[]): void {
      this.regimenespensionarios.clear(); // Limpia el FormArray actual

      lista.forEach((regimen) => {
        this.regimenespensionarios.push(
          this.fb.group({
            pla31regpensionariocod: [regimen.pla31regpensionariocod],
            desregpensionario: [regimen.desregpensionario],
            pla31regpensionariocupss: [regimen.pla31regpensionariocupss],
            pla31fechaini: [regimen.pla31fechaini],
            pla31fechafin: [regimen.pla31fechafin],
            pla31flagcomisionmixta: [regimen.pla31flagcomisionmixta],
          })
        );
      });
    }





    onRowEditInit(regimen: RegimenPensionario): void {
      this.editingRegimenPensionario = { ...regimen };
      this.isEditingAnyRow = true;
    }

    /*
    onRowEditSave(rowIndex: number): void {
      const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;

      console.log(periodo.value);

      // Confirmar la acción antes de guardar
      this.confirmationService.confirm({
        message: '¿Está seguro que desea guardar los cambios en este período laboral?',
        header: 'Confirmar Cambios',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          // Actualizar el FormArray y la lista en el índice correspondiente
          const periodoActualizado: PeriodoLaboral = periodo.value;

          // Actualizar el FormArray
          this.periodoslaborales.at(rowIndex).patchValue(periodoActualizado);

          // Actualizar la lista
          this.periodosLaboralesLista[rowIndex] = { ...periodoActualizado };

          // Eliminar el clon y desactivar el modo de edición
          delete this.clonedPeriodosLaborales[rowIndex];
          this.isEditingAnyRow = false;
          this.editingPeriodoLaboral = null;

          // Habilitar todas las filas
          this.periodoslaborales.controls.forEach((control) => control.enable());

          this.editingPeriodoLaboral = null;
          this.isEditingAnyRow = false;

          // Mostrar mensaje de éxito
          verMensajeInformativo(
            this.messageService,
            'success',
            'Éxito',
            'Período laboral actualizado correctamente'
          );

          console.log('Cambios guardados para el período laboral en la fila:', rowIndex);
          console.log('Datos actualizados:', periodo.value);
        },
        reject: () => {
          // Restaurar el estado de edición y habilitar las filas
          this.isEditingAnyRow = false;
          this.editingPeriodoLaboral = null;

          // Habilitar todas las filas
          this.periodoslaborales.controls.forEach((control) => control.enable());

          // Mostrar mensaje de cancelación
          verMensajeInformativo(
            this.messageService,
            'info',
            'Cancelado',
            'Los cambios no fueron guardados'
          );

          console.log('Edición cancelada para la fila:', rowIndex);
        }
      });
    }


    onRowEditCancel(rowIndex: number): void {
      const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;

      if (this.clonedPeriodosLaborales[rowIndex]) {
        periodo.setValue(this.clonedPeriodosLaborales[rowIndex]); // Restaura los valores originales
        delete this.clonedPeriodosLaborales[rowIndex]; // Elimina el clon
      }

      this.isEditingAnyRow = false; // Indica que no hay filas en edición
      this.editingPeriodoLaboral = null; // Limpia la fila en edición
    }

    onDelete(periodo: PeriodoLaboral, rowIndex: number): void {

      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar este período laboral?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          // Eliminar del FormArray
          this.periodoslaborales.removeAt(rowIndex);

          // Eliminar de la lista sincronizada
          if (rowIndex >= 0 && rowIndex < this.periodosLaboralesLista.length) {
            this.periodosLaboralesLista.splice(rowIndex, 1);
          } else {
            // Fallback por coincidencia de código si los índices no coinciden
            this.periodosLaboralesLista = this.periodosLaboralesLista.filter(
              (p) => p.pla30codigo !== periodo.pla30codigo
            );
          }

          verMensajeInformativo(
            this.messageService,
            'success',
            'Éxito',
            'Período laboral eliminado correctamente'
          );

          console.log('Periodo laboral eliminado: ', periodo);

        },
        reject: () => {
            verMensajeInformativo(
            this.messageService,
            'info',
            'Cancelado',
            'La eliminación del período laboral fue cancelada'
          );
        }
      });
    }

    showAddRow() {
      const nuevoCodigo = this.GenerarNuevoCodigoPeriodo();

      // Inicializar el formulario para el nuevo período laboral
      this.nuevoPeriodoForm.reset({
        pla30codigo: nuevoCodigo, // Asignar el nuevo código generado
        pla30fechaini: null,
        pla30fechafin: null,
        desmotivocese: ''
      });

      this.isEditing = true;
      this.isNew = true;
    }

    onSave() {
      if (this.nuevoPeriodoForm.valid) {

        this.confirmationService.confirm({
          message: '¿Está seguro que desea guardar este nuevo periodo?',
          header: 'Confirmar Periodo',
          icon: 'pi pi-question-circle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          acceptButtonStyleClass: 'p-button',
          rejectButtonStyleClass: 'p-button-danger',
          accept: () => {
            const nuevoPeriodo: PeriodoLaboral = this.nuevoPeriodoForm.value;

            // Verificar si ya existe un período laboral con el mismo código
            const existe = this.periodosLaboralesLista.some(
              (p) => p.pla30codigo === nuevoPeriodo.pla30codigo
            );

            if (existe) {
              verMensajeInformativo(
                this.messageService,
                'error',
                'Error',
                'Ya existe un período laboral con ese código'
              );
              return;
            }

            // Agregar el nuevo período al FormArray
            this.periodoslaborales.push(
              this.fb.group({
                pla30codigo: [nuevoPeriodo.pla30codigo],
                pla30fechaini: [nuevoPeriodo.pla30fechaini],
                pla30fechafin: [nuevoPeriodo.pla30fechafin],
                desmotivocese: [nuevoPeriodo.desmotivocese]
              })
            );

            // Actualizar la lista y limpiar el formulario
            this.periodosLaboralesLista = this.getListaDesdeFormArray();
            this.nuevoPeriodoForm.reset();
            this.isEditing = false;
            this.isNew = false;
            verMensajeInformativo(
              this.messageService,
                'success',
                'Éxito',
                'Nuevo período laboral guardado correctamente'
            );

            console.log('Nuevo período laboral guardado:', nuevoPeriodo);
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
      this.nuevoPeriodoForm.reset();
    }


    public GenerarNuevoCodigoPeriodo(): string {
      // Obtener todos los códigos existentes y convertirlos a números
      const codigos = this.periodosLaboralesLista.map((p) => parseInt(p.pla30codigo, 10));

      // Encontrar el código máximo, si no hay códigos, el máximo será 0
      const max = codigos.length > 0 ? Math.max(...codigos) : 0;

      // Generar el nuevo código incrementando el máximo en 1, y rellenarlo con ceros
      const nuevoCodigo = (max + 1).toString().padStart(4, '0'); // Código de 4 dígitos
      return nuevoCodigo;
    }


    // Abrir el modal
    abrirModalMotivoCese(): void {
      this.mostrarModalMotivoCese = true;

      // Cargar los motivos de cese (puedes reemplazar esto con datos reales)
      this.motivosCese = [
        { codigo: '01', descripcion: 'RENUNCIA' },
        { codigo: '02', descripcion: 'RENUNCIA CON INCENTIVOS' },
        { codigo: '03', descripcion: 'DESPIDO O DESTITUCIÓN' },
        { codigo: '04', descripcion: 'CESE COLECTIVO' }
      ];
    }

    // Seleccionar un motivo de cese
    seleccionarMotivoCese(motivo: { codigo: string; descripcion: string }) {

      if (this.isNew) {
        // Si se está creando un nuevo período, actualizar el formulario del nuevo período
        this.nuevoPeriodoForm.patchValue({
          desmotivocese: motivo.descripcion
        });
      } else if (this.isEditingAnyRow && this.editingPeriodoLaboral) {
        // Si se está editando un período existente, actualizar el FormArray y la lista
        const rowIndex = this.periodosLaboralesLista.findIndex(
          (p) => p.pla30codigo === this.editingPeriodoLaboral?.pla30codigo
        );

        if (rowIndex !== -1) {
          const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;
          periodo.patchValue({
            desmotivocese: motivo.descripcion
          });

          // Actualizar la lista sincronizada
          this.periodosLaboralesLista[rowIndex].desmotivocese = motivo.descripcion;
        }
      }

      // Cerrar el modal
      this.mostrarModalMotivoCese = false;
    }*/


    /*mostrarRegimenesPensionarios(): void {
      console.log(this.regimenespensionarios.controls);
      console.log(this.regimenesPensionariosLista);
    }*/
}
