import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip'; 
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog'; 

import { MessageService } from 'primeng/api'; 

import { verMensajeInformativo, aMayusculas } from 'src/app/demo/components/utilities/funciones_utilitarias'; 

// Importar interfaces (Asegúrate que las rutas sean correctas)
import { Calcular } from '../../model/Calcular'; 
import { DetalleProceso } from 'src/app/demo/model/Calcular'

@Component({
  selector: 'app-calcular',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
 
    TableModule,
    TagModule,
    ButtonModule,
    CheckboxModule,
    RippleModule,
    TooltipModule,
    ToolbarModule,
    ToastModule,
    CardModule,
    DropdownModule, 
    DialogModule, 
  ],
  providers: [MessageService], 
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.css']
})
export class CalcularComponent implements OnInit {

  // --- Variables de Datos y Estado ---
  dataSource: Calcular[] = [
    { pla01empleadocod: '000001', pla01docuidentidadnro: '08980693', apellidosynombres: aMayusculas('Martinez Garcia Joel Alberto'), pla01fechaingreso: new Date('2005-09-18'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000002', pla01docuidentidadnro: '07271641', apellidosynombres: aMayusculas('Calderon Perez Jaime'), pla01fechaingreso: new Date('2008-01-01'), pla57descripcion: 'por defecto', pla51descripcion: 'por defecto', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000007', pla01docuidentidadnro: '10207346', apellidosynombres: aMayusculas('Afrocmisionflujo Debajocultorer Es'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000013', pla01docuidentidadnro: '23456789', apellidosynombres: aMayusculas('Regeneralseguro Sutraiuo Sotrisa'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'CALCULADA' },
    { pla01empleadocod: '000014', pla01docuidentidadnro: '10234545', apellidosynombres: aMayusculas('Etacatinormal Sta'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000015', pla01docuidentidadnro: '43239670', apellidosynombres: aMayusculas('5Tacatextraordinaria 5Tatent'), pla01fechaingreso: new Date('2019-01-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
    { pla01empleadocod: '000016', pla01docuidentidadnro: '10234321', apellidosynombres: aMayusculas('Etacatinormal Certificado Dect'), pla01fechaingreso: new Date('2019-03-01'), pla57descripcion: '...', pla51descripcion: '...', calculoestado: 'SIN CALCULAR' },
  ];

  // Estado de los checkboxes superiores
  boletaChecked: boolean = false;
  planillaGeneralChecked: boolean = false;
  liquidacionChecked: boolean = false;

  rowsPerPage: number = 10;
  
  displayDetalleDialog: boolean = false;
  detalleProcesoData: DetalleProceso[] = [];
  selectedEmpleadoDetalle: Calcular | null = null;

  constructor(private messageService: MessageService) { }
  ngOnInit(): void { }

  getCalculoSeverity(estado: string): 'success' | 'danger' | 'warning' {
      switch (estado) {
          case 'CALCULADA':
              return 'success'; // Verde
          case 'SIN CALCULAR':
              return 'danger'; // Rojo
          default:
              return 'warning'; // Amarillo para cualquier otro estado
      }
  }

  // --- Lógica del Detalle ---

  simularDetalle(empleadoCod: string): DetalleProceso[] {
    if (empleadoCod === '000001') {
      return [
        { pla10conceptocod: '0001', pla10conceptodesc: 'Sueldo Mensual Basico', importe: 3000.00, boleta: 'NO' },
        { pla10conceptocod: '0069', pla10conceptodesc: 'AFECTO A SCTR', importe: 1.00, boleta: 'NO' },
        { pla10conceptocod: '0526', pla10conceptodesc: 'Dias Vacaciones Físicas', importe: 0.00, boleta: 'NO' },
        { pla10conceptocod: '3309', pla10conceptodesc: 'SUELDO BASE 5TA CAT.', importe: 3000.00, boleta: 'NO' },
        { pla10conceptocod: '3311', pla10conceptodesc: 'INGRESOS PROYECTAD...', importe: 6270.00, boleta: 'NO' },
      ];
    }
     if (empleadoCod === '000013') {
      return [
        { pla10conceptocod: '0001', pla10conceptodesc: 'Sueldo', importe: 3500.00, boleta: 'SI' },
        { pla10conceptocod: '0010', pla10conceptodesc: 'Asignación Familiar', importe: 102.50, boleta: 'SI' },
        { pla10conceptocod: '9001', pla10conceptodesc: 'Descuento AFP', importe: -500.00, boleta: 'SI' },
      ];
    }
    return []; 
  }
  
  // --- MÉTODOS DE ACCIÓN ---
  
  verDetalle(empleado: Calcular): void { 
    this.selectedEmpleadoDetalle = empleado;
    this.detalleProcesoData = this.simularDetalle(empleado.pla01empleadocod);
    this.displayDetalleDialog = true;
    
    verMensajeInformativo(
        this.messageService, 
        'info', 
        'Detalle', 
        `Cargando vista de detalle para: ${empleado.apellidosynombres}`
    );
  }
  
  ajustar(empleado: Calcular): void { 
    verMensajeInformativo(
        this.messageService, 
        'warn', 
        'Ajuste', 
        `Ajustar cálculo para: ${empleado.apellidosynombres}`
    );
    console.log('Ajustar cálculo para:', empleado.apellidosynombres); 
  }

  procesarDatos(): void { 
    verMensajeInformativo(
        this.messageService, 
        'success', 
        'Procesando', 
        'Iniciando procesamiento de datos...'
    );
    console.log('Iniciando procesamiento de datos...'); 
  }

  importarArchivos(): void { 
    verMensajeInformativo(
        this.messageService, 
        'info', 
        'Importar', 
        'Abriendo diálogo para importar archivos...'
    );
    console.log('Abriendo diálogo para importar archivos...'); 
  }

  imprimir(): void { 
    verMensajeInformativo(
        this.messageService, 
        'info', 
        'Imprimir', 
        'Generando reporte de impresión...'
    );
    console.log('Imprimiendo...'); 
  }

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