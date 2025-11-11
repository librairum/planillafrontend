/* Milton Garriazo */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';

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
import { PeriodoLaboral } from 'src/app/demo/model/Trabajador';

@Component({
  standalone: true,
  selector: 'app-periodos-laborales',
  templateUrl: './periodos-laborales.component.html',
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
        DropdownModule,
        RadioButtonModule,
        CalendarModule,
        TabViewModule,
      ],
  styleUrls: ['./periodos-laborales.component.css']
})
export class PeriodosLaboralesComponent {

  @Input() periodoslaborales!: FormArray; // Recibe el FormArray desde el componente padre
  @Input() esModoVisualizacion: boolean = false; // Estado de visualización
  @Output() save = new EventEmitter<void>(); // Emite evento al guardar
  @Output() cancel = new EventEmitter<void>(); // Emite evento al cancelar

  constructor(private fb: FormBuilder) {}

  mostrarPeriodosLaborales(): void {
    console.log(this.periodoslaborales.controls);
  }

  agregarPeriodoLaboral(): void {
    this.periodoslaborales.push(
      this.fb.group({
        pla30codigo: [''],
        pla30fechaini: [null],
        pla30fechafin: [null],
        desmotivocese: ['']
      })
    );
  }

  eliminarPeriodoLaboral(index: number): void {
    this.periodoslaborales.removeAt(index);
  }

  clonedPeriodosLaborales: { [key: number]: any } = {}; // Clona los datos originales de las filas

  isEditing: boolean = false;
  editingPeriodoLaboral: PeriodoLaboral | null = null;
  isNew: boolean = false;
  isEditingAnyRow: boolean = false; // Indica si alguna fila está en edición

  onRowEditInit(rowIndex: number): void {
    const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;
    this.clonedPeriodosLaborales[rowIndex] = { ...periodo.value }; // Clona los valores originales
    this.isEditingAnyRow = true; // Indica que hay una fila en edición
    this.editingPeriodoLaboral = { ...periodo.value }; // Guarda los valores de la fila en edición

    // Deshabilitar las demás filas
    this.periodoslaborales.controls.forEach((control, index) => {
      if (index !== rowIndex) {
        control.disable();
      }
    });
  }

  onRowEditSave(rowIndex: number): void {
    const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;

    // Los valores ya están actualizados en el FormGroup, no es necesario volver a asignarlos
    delete this.clonedPeriodosLaborales[rowIndex]; // Elimina el clon
    this.isEditingAnyRow = false; // Indica que no hay filas en edición
    this.editingPeriodoLaboral = null; // Limpia la fila en edición

    // Habilitar todas las filas
    this.periodoslaborales.controls.forEach((control) => control.enable());

    console.log('Guardando cambios para el periodo laboral en la fila:', rowIndex);
    console.log('Datos actualizados:', periodo.value);
  }

  onRowEditCancel(rowIndex: number): void {
    const periodo = this.periodoslaborales.at(rowIndex) as FormGroup;

    if (this.clonedPeriodosLaborales[rowIndex]) {
      periodo.setValue(this.clonedPeriodosLaborales[rowIndex]); // Restaura los valores originales
      delete this.clonedPeriodosLaborales[rowIndex]; // Elimina el clon
    }

    this.isEditingAnyRow = false; // Indica que no hay filas en edición
    this.editingPeriodoLaboral = null; // Limpia la fila en edición

    // Habilitar todas las filas
    this.periodoslaborales.controls.forEach((control) => control.enable());
  }

}
