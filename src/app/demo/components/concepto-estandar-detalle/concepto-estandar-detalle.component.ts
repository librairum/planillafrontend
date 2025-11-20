import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Importar las interfaces desde el archivo de modelo
import {
  TipoCalculo,
  ConceptoTipo,
  SubTipoConcepto,
  ConceptoSunat,
  AfectacionItem,
  ConceptoEstandarDetalle
} from 'src/app/demo/model/ConceptoEstandar';

@Component({
  selector: 'app-concepto-estandar-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    InputTextareaModule,
    TableModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './concepto-estandar-detalle.component.html',
  styleUrls: ['./concepto-estandar-detalle.component.css']
})
export class ConceptoEstandarDetalleComponent implements OnInit {
  // Modos de operación
  isNewRecord: boolean = false;
  esModoVisualizacion: boolean = false;
  codigoConcepto: string = '';

  // Modelo del concepto
  conceptoActual: ConceptoEstandarDetalle = {} as ConceptoEstandarDetalle;

  // Selecciones para los dropdowns
  tipoCalculoSeleccionado: TipoCalculo | null = null;
  conceptoTipoSeleccionado: ConceptoTipo | null = null;
  subTipoSeleccionado: SubTipoConcepto | null = null;
  conceptoSunatSeleccionado: ConceptoSunat | null = null;

  // Catálogos
  tiposCalculo: TipoCalculo[] = [
    { codigo: '01', descripcion: 'Calculo Planillas' },
    { codigo: '02', descripcion: 'Calculo Provision Vacaciones' },
    { codigo: '03', descripcion: 'Calculo Provision Gratificacion' },
    { codigo: '04', descripcion: 'Calculo Provision CTS' }
  ];

  conceptosTipo: ConceptoTipo[] = [
    { codigo: '01', descripcion: 'Ingreso' },
    { codigo: '02', descripcion: 'Egreso' },
    { codigo: '03', descripcion: 'Aportes' },
    { codigo: '04', descripcion: 'Otros' }
  ];

  subTiposConcepto: SubTipoConcepto[] = [
    { conceptoTipoCod: '04', codigo: '01', descripcion: 'Conceptos Fijos' },
    { conceptoTipoCod: '04', codigo: '02', descripcion: 'Concepto Asistencia' },
    { conceptoTipoCod: '04', codigo: '04', descripcion: 'Bases' },
    { conceptoTipoCod: '04', codigo: '08', descripcion: 'Netos' },
    { conceptoTipoCod: '04', codigo: '09', descripcion: 'Adelantos' },
    { conceptoTipoCod: '04', codigo: '11', descripcion: 'Totales' },
    { conceptoTipoCod: '04', codigo: '12', descripcion: 'Asistencia Fechas' },
    { conceptoTipoCod: '04', codigo: '99', descripcion: 'Otros' }
  ];

  conceptosSunat: ConceptoSunat[] = [
    { codigoSunat: '0101', descripcion: 'ALIMENTACIÓN PRINCIPAL EN DINERO' },
    { codigoSunat: '0102', descripcion: 'ALIMENTACIÓN PRINCIPAL EN ESPECIE' },
    { codigoSunat: '0103', descripcion: 'COMISIONES O DESTAJO' },
    { codigoSunat: '0104', descripcion: 'COMISIONES EVENTUALES A TRABAJADOR...' },
    { codigoSunat: '0105', descripcion: 'TRABAJO EN SOBRETIEMPO (HORAS EXT...' },
    { codigoSunat: '0106', descripcion: 'TRABAJO EN SOBRETIEMPO (HORAS EXT...' },
    { codigoSunat: '0107', descripcion: 'TRABAJO EN DÍA FERIADO O DÍA DE DES...' }
  ];

  afectacionesSunat: AfectacionItem[] = [
    { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR...', valor: false },
    { codigo: '04', descripcion: 'ESSALUD SCTR', valor: false },
    { codigo: '07', descripcion: 'SENATI', valor: false },
    { codigo: '08', descripcion: 'SISTEMA NACIONAL DE...', valor: false },
    { codigo: '09', descripcion: 'SISTEMA PRIVADO DE P...', valor: false },
    { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA...', valor: false },
    { codigo: '15', descripcion: 'FONDO COMPLEMENTA...', valor: false }
  ];

  afectacionOtros: AfectacionItem[] = [
    { codigo: '13', descripcion: 'SEGURO VIDA LEY', valor: false },
    { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', valor: false },
    { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', valor: false },
    { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', valor: false },
    { codigo: '20', descripcion: 'INGRESOS VARIABLES P...', valor: false },
    { codigo: '21', descripcion: 'INGRESOS EXTRAORDIN...', valor: false }
  ];

  planillasAsignadas: AfectacionItem[] = [
    { codigo: '01', descripcion: 'Planilla Mensual', valor: true },
    { codigo: '02', descripcion: 'Planilla Vacaciones', valor: true },
    { codigo: '16', descripcion: 'Planilla Gratificaciones ley', valor: true },
    { codigo: '05', descripcion: 'Planilla Liquidaciones', valor: true },
    { codigo: '04', descripcion: 'Planilla Utilidades', valor: true },
    { codigo: '20', descripcion: 'Planilla Quincenal Adela...', valor: true }
  ];

  regimenesLaborales: AfectacionItem[] = [
    { codigo: '01', descripcion: 'PRIVADO...', valor: true },
    { codigo: '16', descripcion: 'MICROE...', valor: true },
    { codigo: '17', descripcion: 'PEQUEÑA...', valor: true },
    { codigo: '18', descripcion: 'AGRARIO...', valor: true },
    { codigo: '20', descripcion: 'MINEROS', valor: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.codigoConcepto = params['codigo'];

      this.route.queryParams.subscribe(queryParams => {
        const modo = queryParams['modo'];

        if (this.codigoConcepto === 'nuevo') {
          this.isNewRecord = true;
          this.esModoVisualizacion = false;
          this.inicializarNuevoConcepto();
        } else {
          this.isNewRecord = false;
          this.esModoVisualizacion = modo === 'visualizar';
          this.cargarConcepto(this.codigoConcepto);
        }
      });
    });
  }

  inicializarNuevoConcepto() {
    this.conceptoActual = {
      codigo: '',
      descripcion: '',
      imprimible: false,
      configBasica: true,
      formulable: false,
      activo: true,
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };
  }

  cargarConcepto(codigo: string) {
    this.conceptoActual = {
      codigo: codigo,
      descripcion: 'Sueldo Mensual Basico',
      imprimible: false,
      configBasica: true,
      formulable: false,
      activo: true,
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };

    this.tipoCalculoSeleccionado = this.tiposCalculo[0];
    this.conceptoTipoSeleccionado = this.conceptosTipo[3];
    this.subTipoSeleccionado = this.subTiposConcepto[0];
  }

  onTipoCalculoChange(event: any) {
    // Lógica adicional si es necesario
  }

  onConceptoTipoChange(event: any) {
    // Lógica adicional si es necesario
  }

  onSubTipoChange(event: any) {
    // Lógica adicional si es necesario
  }

  onConceptoSunatChange(event: any) {
    // Lógica adicional si es necesario
  }

  guardarConcepto() {
    if (!this.conceptoActual.codigo || !this.conceptoActual.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: this.isNewRecord ? 'Concepto creado correctamente' : 'Concepto actualizado correctamente'
    });

    setTimeout(() => {
      this.volver();
    }, 1000);
  }

  volver() {
    this.router.navigate(['/home/maestro-estandar/concepto']);
  }

  getTitulo(): string {
    if (this.isNewRecord) {
      return 'Nuevo Concepto';
    }
    return this.esModoVisualizacion ? 'Visualización de Concepto' : 'Editar Concepto';
  }

  get subTiposFiltrados(): SubTipoConcepto[] {
    if (!this.conceptoTipoSeleccionado) {
      return this.subTiposConcepto;
    }
    return this.subTiposConcepto.filter(
      st => st.conceptoTipoCod === this.conceptoTipoSeleccionado!.codigo
    );
  }
}
