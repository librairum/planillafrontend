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
      id: [null],
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
        console.log('Regímenes Pensionarios cargados:', this.regimenesPensionariosLista);
    }


    getListaDesdeFormArray(): RegimenPensionario[] {
      return this.regimenespensionarios.value;
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


    cargarTabla() {
      this.setFormArrayDesdeLista(this.regimenesPensionariosLista);
    }


    onRowEditInit(regimen: RegimenPensionario, rowIndex: number): void {
      // Guardar los valores originales en clonedRegimenesPensionarios
      this.clonedRegimenesPensionarios[rowIndex] = { ...regimen };

      // Establecer el estado de edición
      this.editingRegimenPensionario = { ...regimen };
      this.isEditingAnyRow = true;

      console.log('Edición iniciada. Valores originales guardados:', this.clonedRegimenesPensionarios[rowIndex]);
    }

    onRowEditSave(rowIndex: number): void {
      const regimen = this.regimenespensionarios.at(rowIndex) as FormGroup;

      // Confirmar la acción antes de guardar
      this.confirmationService.confirm({
        message: '¿Está seguro que desea guardar los cambios en este régimen pensionario?',
        header: 'Confirmar Cambios',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          // Actualizar el FormArray y la lista en el índice correspondiente
          const regimenActualizado: RegimenPensionario = {
            ...regimen.value
          };

          console.log('Valor actualizado:', regimenActualizado.pla31flagcomisionmixta);



          // Actualizar el FormArray
          this.regimenespensionarios.at(rowIndex).patchValue(regimenActualizado);

          // Actualizar la lista
          //this.setFormArrayDesdeLista(this.regimenesPensionariosLista);
          this.regimenesPensionariosLista[rowIndex] = { ...regimenActualizado };


          // Eliminar el clon y desactivar el modo de edición
          delete this.clonedRegimenesPensionarios[rowIndex];
          this.isEditingAnyRow = false;
          this.editingRegimenPensionario = null;

          // Habilitar todas las filas
          this.regimenespensionarios.controls.forEach((control) => control.enable());

          this.editingRegimenPensionario = null;
          this.isEditingAnyRow = false;

          // Mostrar mensaje de éxito
          verMensajeInformativo(
            this.messageService,
            'success',
            'Éxito',
            'Regimen pensionario actualizado correctamente'
          );

          console.log('Cambios guardados para el régimen pensionario en la fila:', rowIndex);
          console.log('Datos actualizados:', regimen.value);
        },
        reject: () => {
          // Restaurar el estado de edición y habilitar las filas
          this.isEditingAnyRow = false;
          this.editingRegimenPensionario = null;

          // Habilitar todas las filas
          this.regimenespensionarios.controls.forEach((control) => control.enable());

          // Mostrar mensaje de cancelación
          verMensajeInformativo(
            this.messageService,
            'info',
            'Cancelado',
            'Los cambios no fueron guardados'
          );
        }
      });
    }


    onRowEditCancel(rowIndex: number): void {
      console.log('Cancelando edición. Valores originales:', this.clonedRegimenesPensionarios[rowIndex]);

      const regimen = this.regimenespensionarios.at(rowIndex) as FormGroup;

      if (this.clonedRegimenesPensionarios[rowIndex]) {
        // Restaurar los valores originales desde el clon
        regimen.setValue(this.clonedRegimenesPensionarios[rowIndex]);

        // Restaurar los valores en la lista sincronizada
        this.regimenesPensionariosLista[rowIndex] = { ...this.clonedRegimenesPensionarios[rowIndex] };

        // Eliminar el clon
        delete this.clonedRegimenesPensionarios[rowIndex];
      }

      // Restablecer el estado de edición
      this.isEditingAnyRow = false;
      this.editingRegimenPensionario = null;

      // Habilitar todas las filas
      this.regimenespensionarios.controls.forEach((control) => control.enable());

      console.log('Edición cancelada. Fila restaurada:', this.regimenespensionarios.at(rowIndex).value);
    }


    onDelete(regimen: RegimenPensionario, rowIndex: number): void {

      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar este régimen pensionario?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          // Eliminar del FormArray
          this.regimenespensionarios.removeAt(rowIndex);

          // Eliminar de la lista sincronizada
          if (rowIndex >= 0 && rowIndex < this.regimenesPensionariosLista.length) {
            this.regimenesPensionariosLista.splice(rowIndex, 1);
          } else {
            // Fallback por coincidencia de código si los índices no coinciden
            this.regimenesPensionariosLista = this.regimenesPensionariosLista.filter(
              (p) => p.pla31regpensionariocod !== regimen.pla31regpensionariocod
            );
          }

          verMensajeInformativo(
            this.messageService,
            'success',
            'Éxito',
            'Régimen pensionario eliminado correctamente'
          );

          console.log('Régimen pensionario eliminado: ', regimen);

        },
        reject: () => {
            verMensajeInformativo(
            this.messageService,
            'info',
            'Cancelado',
            'La eliminación del régimen pensionario fue cancelada'
          );
        }
      });
    }


    showAddRow() {

      this.nuevoRegimenForm.reset({
        pla31regpensionariocod: '',
        desregpensionario: '',
        pla31regpensionariocupss: '',
        pla31fechaini: null,
        pla31fechafin: null,
        pla31flagcomisionmixta: '0',
      });

      this.isEditing = true;
      this.isNew = true;
    }


    onSave() {
      if (this.nuevoRegimenForm.valid) {

        this.confirmationService.confirm({
          message: '¿Está seguro que desea guardar este nuevo régimen?',
          header: 'Confirmar Régimen',
          icon: 'pi pi-question-circle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          acceptButtonStyleClass: 'p-button',
          rejectButtonStyleClass: 'p-button-danger',
          accept: () => {
            const nuevoRegimen: RegimenPensionario = {
              ...this.nuevoRegimenForm.value,
            };

            // Verificar si ya existe un régimen pensionario con el mismo código
            const existe = this.regimenesPensionariosLista.some(
              (p) => p.pla31regpensionariocod === nuevoRegimen.pla31regpensionariocod
            );

            if (existe) {
              verMensajeInformativo(
                this.messageService,
                'error',
                'Error',
                'Ya existe un régimen pensionario con ese código'
              );
              return;
            }

            // Agregar el nuevo período al FormArray
            this.regimenespensionarios.push(
              this.fb.group({
                pla31regpensionariocod: [nuevoRegimen.pla31regpensionariocod],
                desregpensionario: [nuevoRegimen.desregpensionario],
                pla31regpensionariocupss: [nuevoRegimen.pla31regpensionariocupss],
                pla31fechaini: [nuevoRegimen.pla31fechaini],
                pla31fechafin: [nuevoRegimen.pla31fechafin],
                pla31flagcomisionmixta: [nuevoRegimen.pla31flagcomisionmixta]
              })
            );

            // Actualizar la lista y limpiar el formulario
            this.regimenesPensionariosLista = this.getListaDesdeFormArray();
            this.nuevoRegimenForm.reset();
            this.isEditing = false;
            this.isNew = false;
            verMensajeInformativo(
              this.messageService,
                'success',
                'Éxito',
                'Nuevo régimen pensionario guardado correctamente'
            );

            console.log('Nuevo régimen pensionario guardado:', nuevoRegimen);
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
      this.nuevoRegimenForm.reset();

      this.regimenespensionarios.controls.forEach((control) => control.enable());
    }


    // Abrir el modal
    abrirModalTiposRegimenPensionario(): void {
      this.mostrarModalRegimenPensionario = true;

      // Cargar los motivos de cese (puedes reemplazar esto con datos reales)
      this.tiposRegimenesPensionarios = [
        { codigo: '02', descripcion: 'DL 19990 SIST NAC DE PENS - ONP', clase: 'ONP', afpcod: '00' },
        { codigo: '12', descripcion: 'OTROS REGIMENES PENSIONARIOS', clase: 'SRP', afpcod: '' },
        { codigo: '21', descripcion: 'SPP INTEGRA', clase: 'SPP', afpcod: '01' },
        { codigo: '22', descripcion: 'SPP HORIZONTE', clase: 'SPP', afpcod: '02' },
      ];

      console.log('Modal abierto para seleccionar tipo de régimen pensionario.');
    }


    // Seleccionar un motivo de cese
    //falta corregir
    seleccionarTipoRegimenPensionario(tiporegimen: { codigo: string; descripcion: string, clase: string, afpcod: string }) {

      if (this.isNew) {
        // Si se está creando un nuevo período, actualizar el formulario del nuevo período
        this.nuevoRegimenForm.patchValue({
          pla31regpensionariocod: tiporegimen.codigo,
          desregpensionario: tiporegimen.descripcion
        });
      } else if (this.isEditingAnyRow && this.editingRegimenPensionario) {
        // Si se está editando un período existente, actualizar el FormArray y la lista
        const rowIndex = this.regimenesPensionariosLista.findIndex(
          (r) => r.pla31regpensionariocod === this.editingRegimenPensionario?.pla31regpensionariocod
        );

        if (rowIndex !== -1) {
          const regimen = this.regimenespensionarios.at(rowIndex) as FormGroup;

          regimen.patchValue({
            pla31regpensionariocod: tiporegimen.codigo,
            desregpensionario: tiporegimen.descripcion
          });

          // Actualizar la lista sincronizada
          this.regimenesPensionariosLista[rowIndex].pla31regpensionariocod = tiporegimen.codigo;
          this.regimenesPensionariosLista[rowIndex].desregpensionario = tiporegimen.descripcion;

          this.editingRegimenPensionario.pla31regpensionariocod = tiporegimen.codigo;
          this.editingRegimenPensionario.desregpensionario = tiporegimen.descripcion
        }
      }

      // Cerrar el modal
      this.mostrarModalRegimenPensionario = false;
    }


    mostrarRegimenesPensionarios(): void {
      console.log(this.regimenespensionarios.controls);
      console.log('FormArray:', this.regimenespensionarios.value);
      console.log('Lista:', this.regimenesPensionariosLista);
    }
}
