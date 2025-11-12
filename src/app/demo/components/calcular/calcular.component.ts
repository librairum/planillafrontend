
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip'; 

import { Calcular } from '../../model/Calcular'; 

@Component({
  selector: 'app-calcular',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    TagModule,
    RippleModule,
    TooltipModule
  ],
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.css']
})
export class CalcularComponent implements OnInit {

  // Datos de ejemplo basados en la imagen (ajustados para el tipo Date)
  dataSource: Calcular[] = [
    { pla01empleadocod: '000001', pla01docuidentidadnro: '08980693', apellidosynombres: 'MARTINEZ GARCIA JOEL ALBERTO', pla01fechaingreso: new Date('2005-09-18'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000002', pla01docuidentidadnro: '07271641', apellidosynombres: 'CALDERON PEREZ JAIME', pla01fechaingreso: new Date('2008-01-01'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000007', pla01docuidentidadnro: '10207346', apellidosynombres: 'AFROCMISIONFLUJO DEBAJOCULTORERES..', pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000013', pla01docuidentidadnro: '23456789', apellidosynombres: 'REGENERALSEGURO SUTRAIUO SOTRISA', pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'CALCULADA' },
    // ... Agregar el resto de los registros aquí ...
  ];

  // Estado de los checkboxes superiores
  boletaChecked: boolean = false;
  planillaGeneralChecked: boolean = false;
  liquidacionChecked: boolean = false;

  constructor() { }
  ngOnInit(): void { }

  // --- MÉTODOS DE ACCIÓN ---
  procesarDatos(): void { 
    console.log('Iniciando procesamiento de datos...'); 
  }

  importarArchivos(): void { 
    console.log('Abriendo diálogo para importar archivos...'); }

  imprimir(): void { 
    console.log('Imprimiendo...'); 
  }
  verDetalle(empleado: Calcular): void { 
    console.log('Ver Detalle de:', empleado.apellidosynombres); 
  }
  ajustar(empleado: Calcular): void { 
    console.log('Ajustar cálculo para:', empleado.apellidosynombres); 
  }

  // Métodos para los checkboxes que están agrupados con Imprimir
  toggleBoleta(): void { 
    console.log('Boleta:', this.boletaChecked); 
  }
  togglePlanillaGeneral(): void { 
    console.log('Planilla General:', this.planillaGeneralChecked); 
  }
  toggleLiquidacion(): void { 
    console.log('Liquidación:', this.liquidacionChecked); 
  }
}