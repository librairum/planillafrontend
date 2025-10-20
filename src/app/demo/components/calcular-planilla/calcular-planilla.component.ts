import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calcular-planilla',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    CardModule,
    StepsModule,
    TooltipModule,
    PanelModule
  ],
  templateUrl: './calcular-planilla.component.html',
  styleUrls: ['./calcular-planilla.component.css']
})
export class CalcularPlanillaComponent implements OnInit {
  // Datos del formulario
  planilla: string = '';
  codigo: string = '2025101';
  descripcion: string = '';
  fecInicio: Date = new Date();
  fecFin: Date = new Date();
  fecBoleta: Date = new Date();
  tCambio: string = '';
  ultimaPlanillaMes: boolean = false;

  // Steps del asistente
  items: MenuItem[] = [];
  activeIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Datos Generales',
        icon: 'pi pi-file'
      },
      {
        label: 'Confirmación',
        icon: 'pi pi-check'
      }
    ];

    // Inicializar con fecha actual
    this.fecInicio = new Date(2025, 9, 20); // 20/10/2025
    this.fecFin = new Date(2025, 9, 20);
    this.fecBoleta = new Date(2025, 9, 20);
  }

  onActiveIndexChange(index: number) {
    this.activeIndex = index;
  }

  anterior() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  siguiente() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    } else {
      this.finalizar();
    }
  }

  cancelar() {
    // Limpiar formulario o navegar
    this.router.navigate(['/home']);
  }

  finalizar() {
    // Aquí iría la lógica para guardar/procesar la planilla
    console.log('Procesando planilla:', {
      planilla: this.planilla,
      codigo: this.codigo,
      descripcion: this.descripcion,
      fecInicio: this.fecInicio,
      fecFin: this.fecFin,
      fecBoleta: this.fecBoleta,
      tCambio: this.tCambio,
      ultimaPlanillaMes: this.ultimaPlanillaMes
    });
    
    alert('¡Planilla calculada exitosamente!');
    this.router.navigate(['/home']);
  }

  get botonSiguienteTexto(): string {
    return this.activeIndex === this.items.length - 1 ? 'Finalizar' : 'Siguiente';
  }

  get mostrarBotonAnterior(): boolean {
    return this.activeIndex > 0;
  }
}