import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

// Importar la interface desde el archivo de modelo
import { ConceptoEstandar } from 'src/app/demo/model/ConceptoEstandar';

@Component({
  selector: 'app-concepto-estandar',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './concepto-estandar.component.html',
  styleUrls: ['./concepto-estandar.component.css']
})
export class ConceptoEstandarComponent implements OnInit {
  conceptos: ConceptoEstandar[] = [];

  constructor(
    private router: Router,
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

  agregarNuevo() {
    this.router.navigate(['/home/maestro-estandar/concepto/detalle', 'nuevo']);
  }

  editarConcepto(concepto: ConceptoEstandar) {
    this.router.navigate(['/home/maestro-estandar/concepto/detalle', concepto.codigo], {
      queryParams: { modo: 'editar' }
    });
  }

  mostrarDetalleConcepto(concepto: ConceptoEstandar) {
    this.router.navigate(['/home/maestro-estandar/concepto/detalle', concepto.codigo], {
      queryParams: { modo: 'visualizar' }
    });
  }

  eliminarConcepto(concepto: ConceptoEstandar) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este concepto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.conceptos = this.conceptos.filter(c => c.codigo !== concepto.codigo);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Concepto eliminado correctamente'
        });
      }
    });
  }

  refrescarTabla() {
    this.loadConceptos();
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Lista actualizada correctamente'
    });
  }

  mostrarAyuda(concepto: ConceptoEstandar) {
    this.messageService.add({
      severity: 'info',
      summary: 'Ayuda del Concepto',
      detail: `Información sobre el concepto: ${concepto.descripcion}`
    });
  }
}
