import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

interface ConceptoEstandar {
  codigo: string;
  descripcion: string;
  impresion: string;
  activo: string;
  configurable: string;
  conceptoSunat: string;
  conceptoTipoDesc: string;
  conceptoSubTipoc: string;
  tipo: string;
}

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

interface AfectacionSunat {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

interface AfectacionOtros {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

interface PlanillaAsignada {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

interface RegimenLaboral {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

@Component({
  selector: 'app-concepto-estandar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    CheckboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './concepto-estandar.component.html',
  styleUrls: ['./concepto-estandar.component.css']
})
export class ConceptoEstandarComponent implements OnInit {
  conceptos: ConceptoEstandar[] = [];

  // Control del diálogo principal
  displayDialog: boolean = false;
  isNewRecord: boolean = false;
  esModoVisualizacion: boolean = false; // PROPIEDAD PARA MODO VISUALIZACIÓN

  // Diálogos de búsqueda (Auxiliares)
  displayTipoCalculoDialog: boolean = false;
  displayConceptoTipoDialog: boolean = false;
  displaySubTipoDialog: boolean = false;
  displayConceptoSunatDialog: boolean = false;
  // --- SE ELIMINÓ displayBusquedaDialog ---

  // Modelo del concepto actual
  conceptoActual: any = {};

  // --- SE ELIMINÓ textoBusqueda ---

  // Datos de los catálogos
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

  // Afectaciones
  afectacionesSunat: AfectacionSunat[] = [
    { codigo: '01', descripcion: 'ESSALUD SEGURO REGULAR...', valor: false },
    { codigo: '04', descripcion: 'ESSALUD SCTR', valor: false },
    { codigo: '07', descripcion: 'SENATI', valor: false },
    { codigo: '08', descripcion: 'SISTEMA NACIONAL DE...', valor: false },
    { codigo: '09', descripcion: 'SISTEMA PRIVADO DE P...', valor: false },
    { codigo: '10', descripcion: 'RENTA 5TA CATEGORÍA...', valor: false },
    { codigo: '15', descripcion: 'FONDO COMPLEMENTA...', valor: false }
  ];

  afectacionOtros: AfectacionOtros[] = [
    { codigo: '13', descripcion: 'SEGURO VIDA LEY', valor: false },
    { codigo: '14', descripcion: 'JUICIO POR ALIMENTOS', valor: false },
    { codigo: '16', descripcion: 'SCTR PENSION PRIVADO', valor: false },
    { codigo: '17', descripcion: 'CTS 6 ULTIMAS REM', valor: false },
    { codigo: '20', descripcion: 'INGRESOS VARIABLES P...', valor: false },
    { codigo: '21', descripcion: 'INGRESOS EXTRAORDIN...', valor: false }
  ];

  planillasAsignadas: PlanillaAsignada[] = [
    { codigo: '01', descripcion: 'Planilla Mensual', valor: true },
    { codigo: '02', descripcion: 'Planilla Vacaciones', valor: true },
    { codigo: '16', descripcion: 'Planilla Gratificaciones ley', valor: true },
    { codigo: '05', descripcion: 'Planilla Liquidaciones', valor: true },
    { codigo: '04', descripcion: 'Planilla Utilidades', valor: true },
    { codigo: '20', descripcion: 'Planilla Quincenal Adela...', valor: true }
  ];

  regimenesLaborales: RegimenLaboral[] = [
    { codigo: '01', descripcion: 'PRIVADO...', valor: true },
    { codigo: '16', descripcion: 'MICROE...', valor: true },
    { codigo: '17', descripcion: 'PEQUEÑA...', valor: true },
    { codigo: '18', descripcion: 'AGRARIO...', valor: true },
    { codigo: '20', descripcion: 'MINEROS', valor: true }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadConceptos();
  }

  loadConceptos() {
    this.conceptos = [
      {
        codigo: '0001',
        descripcion: 'Sueldo Mensual Basico',
        impresion: 'N',
        activo: 'S',
        configurable: 'S',
        conceptoSunat: 'Otros',
        conceptoTipoDesc: 'Otros',
        conceptoSubTipoc: 'Conceptos Fijos',
        tipo: 'Estandar'
      },
      {
        codigo: '0006',
        descripcion: 'Haber Diario Basico',
        impresion: 'N',
        activo: 'S',
        configurable: 'S',
        conceptoSunat: 'Otros',
        conceptoTipoDesc: 'Otros',
        conceptoSubTipoc: 'Conceptos Fijos',
        tipo: 'Estandar'
      },
      {
        codigo: '0011',
        descripcion: 'Tasa Retencion Judicial #1',
        impresion: 'N',
        activo: 'N',
        configurable: 'S',
        conceptoSunat: 'Otros',
        conceptoTipoDesc: 'Otros',
        conceptoSubTipoc: 'Conceptos Fijos',
        tipo: 'Estandar'
      },
      {
        codigo: '0016',
        descripcion: 'Tasa Retencion Judicial #2',
        impresion: 'N',
        activo: 'N',
        configurable: 'S',
        conceptoSunat: 'Otros',
        conceptoTipoDesc: 'Otros',
        conceptoSubTipoc: 'Conceptos Fijos',
        tipo: 'Estandar'
      },
      {
        codigo: '0021',
        descripcion: 'Tasa Retencion Judicial #3',
        impresion: 'N',
        activo: 'N',
        configurable: 'S',
        conceptoSunat: 'Otros',
        conceptoTipoDesc: 'Otros',
        conceptoSubTipoc: 'Conceptos Fijos',
        tipo: 'Estandar'
      }
    ];
  }

  // Agregar nuevo concepto
  agregarNuevo() {
    this.isNewRecord = true;
    this.esModoVisualizacion = false; // Desactivar modo visualización
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
    this.displayDialog = true;
  }

  // Editar concepto
  editarConcepto(concepto: ConceptoEstandar) {
    this.isNewRecord = false;
    this.esModoVisualizacion = false; // Desactivar modo visualización
    this.conceptoActual = {
      codigo: concepto.codigo,
      descripcion: concepto.descripcion,
      tipoCalculoCod: '01',
      tipoCalculoDes: 'Calculo Planill',
      tipoCod: '04',
      tipoDes: 'Otros',
      subTipoCod: '01',
      subTipoDes: 'Conceptos Fijo',
      imprimible: concepto.impresion === 'S',
      configBasica: concepto.configurable === 'S',
      formulable: false,
      activo: concepto.activo === 'S',
      conceptoSunatCod: '',
      conceptoSunatDes: concepto.conceptoSunat,
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };
    this.displayDialog = true;
  }

  // MÉTODO AHORA USADO POR EL BOTÓN 'VER': Mostrar detalle en modo visualización
  mostrarDetalleConcepto(concepto: ConceptoEstandar) {
    this.isNewRecord = false;
    this.esModoVisualizacion = true; // ACTIVAR MODO VISUALIZACIÓN
    this.conceptoActual = {
      codigo: concepto.codigo,
      descripcion: concepto.descripcion,
      tipoCalculoCod: '01',
      tipoCalculoDes: 'Calculo Planill',
      tipoCod: '04',
      tipoDes: 'Otros',
      subTipoCod: '01',
      subTipoDes: 'Conceptos Fijo',
      imprimible: concepto.impresion === 'S',
      configBasica: concepto.configurable === 'S',
      formulable: false,
      activo: concepto.activo === 'S',
      conceptoSunatCod: '',
      conceptoSunatDes: concepto.conceptoSunat,
      observacion: '',
      afectacionesSunat: JSON.parse(JSON.stringify(this.afectacionesSunat)),
      afectacionOtros: JSON.parse(JSON.stringify(this.afectacionOtros)),
      planillasAsignadas: JSON.parse(JSON.stringify(this.planillasAsignadas)),
      regimenesLaborales: JSON.parse(JSON.stringify(this.regimenesLaborales))
    };
    this.displayDialog = true;
  }

  // Abrir diálogo de búsqueda
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

  // Seleccionar de catálogos
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

    this.displayDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Concepto guardado correctamente'
    });
  }

  // Cancelar edición
  cancelarEdicion() {
    this.displayDialog = false;
    this.conceptoActual = {};
    this.esModoVisualizacion = false; // Resetear modo visualización
  }

  // Eliminar concepto
  eliminarConcepto(concepto: ConceptoEstandar) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este concepto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const index = this.conceptos.indexOf(concepto);
        this.conceptos.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Concepto eliminado correctamente'
        });
      }
    });
  }

  // --- SE ELIMINARON LOS MÉTODOS: ---
  // - buscarConceptos()
  // - ejecutarBusqueda()
  // - cancelarBusqueda()

  // Refrescar tabla
  refrescarTabla() {
    this.loadConceptos();
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Lista actualizada correctamente'
    });
  }

  // Validar solo números en inputs
  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Mostrar ayuda sobre el concepto
  mostrarAyuda(concepto: ConceptoEstandar) {
    this.messageService.add({
      severity: 'info',
      summary: 'Ayuda del Concepto',
      detail: `Información sobre el concepto: ${concepto.descripcion}`
    });
  }
}