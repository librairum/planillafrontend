import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface TipoCalculo {
  codigo: string;
  descripcion: string;
}

interface ConceptoTipo {
  codigo: string;
  descripcion: string;
}

interface SubTipoConcepto {
  conceptoTipoCod: string;
  codigo: string;
  descripcion: string;
}

interface ConceptoSunat {
  codigoSunat: string;
  descripcion: string;
}

interface AfectacionItem {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

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
    DialogModule,
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
  conceptoActual: any = {};

  // Diálogos auxiliares
  displayTipoCalculoDialog: boolean = false;
  displayConceptoTipoDialog: boolean = false;
  displaySubTipoDialog: boolean = false;
  displayConceptoSunatDialog: boolean = false;

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
    // Obtener el código del concepto de la ruta
    this.route.params.subscribe(params => {
      this.codigoConcepto = params['codigo'];
      
      // Obtener el modo de operación
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
      tipoCalculoCod: '',
      tipoCalculoDes: '',
      tipoCod: '',
      tipoDes: '',
      subTipoCod: '',
      subTipoDes: '',
      imprimible: false,
      configBasica: true,
      formulable: false,
      activo: true,
      conceptoSunatCod: '',
      conceptoSunatDes: '',
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };
  }

  cargarConcepto(codigo: string) {
    // Aquí normalmente llamarías a un servicio
    // Por ahora, simulamos la carga con datos hardcodeados
    this.conceptoActual = {
      codigo: codigo,
      descripcion: 'Sueldo Mensual Basico',
      tipoCalculoCod: '01',
      tipoCalculoDes: 'Calculo Planillas',
      tipoCod: '04',
      tipoDes: 'Otros',
      subTipoCod: '01',
      subTipoDes: 'Conceptos Fijos',
      imprimible: false,
      configBasica: true,
      formulable: false,
      activo: true,
      conceptoSunatCod: '',
      conceptoSunatDes: 'Otros',
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };
  }

  // Métodos para abrir diálogos de búsqueda
  abrirBusquedaTipoCalculo() {
    if (!this.esModoVisualizacion) {
      this.displayTipoCalculoDialog = true;
    }
  }

  abrirBusquedaConceptoTipo() {
    if (!this.esModoVisualizacion) {
      this.displayConceptoTipoDialog = true;
    }
  }

  abrirBusquedaSubTipo() {
    if (!this.esModoVisualizacion) {
      this.displaySubTipoDialog = true;
    }
  }

  abrirBusquedaConceptoSunat() {
    if (!this.esModoVisualizacion) {
      this.displayConceptoSunatDialog = true;
    }
  }

  // Métodos de selección
  seleccionarTipoCalculo(tipo: TipoCalculo) {
    this.conceptoActual.tipoCalculoCod = tipo.codigo;
    this.conceptoActual.tipoCalculoDes = tipo.descripcion;
    this.displayTipoCalculoDialog = false;
  }

  seleccionarConceptoTipo(tipo: ConceptoTipo) {
    this.conceptoActual.tipoCod = tipo.codigo;
    this.conceptoActual.tipoDes = tipo.descripcion;
    this.displayConceptoTipoDialog = false;
  }

  seleccionarSubTipo(subTipo: SubTipoConcepto) {
    this.conceptoActual.subTipoCod = subTipo.codigo;
    this.conceptoActual.subTipoDes = subTipo.descripcion;
    this.displaySubTipoDialog = false;
  }

  seleccionarConceptoSunat(concepto: ConceptoSunat) {
    this.conceptoActual.conceptoSunatCod = concepto.codigoSunat;
    this.conceptoActual.conceptoSunatDes = concepto.descripcion;
    this.displayConceptoSunatDialog = false;
  }

  // Guardar concepto
  guardarConcepto() {
    if (!this.conceptoActual.codigo || !this.conceptoActual.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

    // Aquí normalmente llamarías a un servicio para guardar
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: this.isNewRecord ? 'Concepto creado correctamente' : 'Concepto actualizado correctamente'
    });

    // Regresar a la lista después de guardar
    setTimeout(() => {
      this.volver();
    }, 1000);
  }

  // Volver a la lista
  volver() {
  this.router.navigate(['/home/maestro-estandar/concepto']);
}

  // Validar solo números
  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Obtener título del formulario
  getTitulo(): string {
    if (this.isNewRecord) {
      return 'Nuevo Concepto';
    }
    return this.esModoVisualizacion ? 'Visualización de Concepto' : 'Editar Concepto';
  }
}