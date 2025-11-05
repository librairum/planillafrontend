import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

interface Trabajador {
  codigo: string;
  idIdentidad: string;
  apellidosNombres: string;
  fechaIngreso: Date;
  estado: string;
  dias: number;
  horas: number;
  heSimples: number;
  heDobles: number;
  he100: number;
  hNocturnas: number;
  diasCompensados: number;
  diasEnfermedad: number;
  diasSubsidioEnfermedad: number;
  diasSubsidioMaterno: number;
  diasLicencia: number;
  faltas: number;
}

interface Inasistencia {
  tipoSuspension: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasNoTrabajados: number;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  rowsPerPage: number = 10; 
  selectedTrabajador: Trabajador | null = null;
  displayInasistenciaDialog: boolean = false;
  globalFilterValue: string = '';

  // Formulario de inasistencia
  inasistenciaForm: Inasistencia = this.createEmptyInasistencia();

  // Opciones para dropdowns
  tipoSuspensionOptions = [
    { label: 'Falta', value: 'FALTA' },
    { label: 'Licencia con goce', value: 'LICENCIA_GOCE' },
    { label: 'Licencia sin goce', value: 'LICENCIA_SIN_GOCE' },
    { label: 'Descanso médico', value: 'DESCANSO_MEDICO' },
    { label: 'Subsidio por enfermedad', value: 'SUBSIDIO_ENFERMEDAD' },
    { label: 'Subsidio por maternidad', value: 'SUBSIDIO_MATERNIDAD' },
    { label: 'Vacaciones', value: 'VACACIONES' },
    { label: 'Suspensión perfecta', value: 'SUSPENSION_PERFECTA' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTrabajadores();
  }

  createEmptyInasistencia(): Inasistencia {
    return {
      tipoSuspension: '',
      descripcion: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      diasNoTrabajados: 0
    };
  }

  loadTrabajadores() {
    // Datos de ejemplo basados en las capturas
    this.trabajadores = [
      {
        codigo: '000001',
        idIdentidad: '08680851',
        apellidosNombres: 'MARTINEZ GARCIA Joel',
        fechaIngreso: new Date(2006, 7, 16),
        estado: 'A',
        dias: 31,
        horas: 0,
        heSimples: 0,
        heDobles: 0,
        he100: 0,
        hNocturnas: 0,
        diasCompensados: 0,
        diasEnfermedad: 0,
        diasSubsidioEnfermedad: 0,
        diasSubsidioMaterno: 0,
        diasLicencia: 0,
        faltas: 0
      },
      {
        codigo: '000002',
        idIdentidad: '07271641',
        apellidosNombres: 'CALDERON PEREZ PYME',
        fechaIngreso: new Date(2006, 0, 1),
        estado: 'A',
        dias: 31,
        horas: 0,
        heSimples: 0,
        heDobles: 0,
        he100: 0,
        hNocturnas: 0,
        diasCompensados: 0,
        diasEnfermedad: 0,
        diasSubsidioEnfermedad: 0,
        diasSubsidioMaterno: 0,
        diasLicencia: 0,
        faltas: 0
      },
      {
        codigo: '000003',
        idIdentidad: '10861418',
        apellidosNombres: 'SARMIENTO RENDON',
        fechaIngreso: new Date(2019, 0, 1),
        estado: 'A',
        dias: 31,
        horas: 0,
        heSimples: 0,
        heDobles: 0,
        he100: 0,
        hNocturnas: 0,
        diasCompensados: 0,
        diasEnfermedad: 0,
        diasSubsidioEnfermedad: 0,
        diasSubsidioMaterno: 0,
        diasLicencia: 0,
        faltas: 0
      },
      {
        codigo: '000007',
        idIdentidad: '10207645',
        apellidosNombres: 'AFP Comision Flujo Detallado',
        fechaIngreso: new Date(2019, 0, 1),
        estado: 'A',
        dias: 31,
        horas: 0,
        heSimples: 0,
        heDobles: 0,
        he100: 0,
        hNocturnas: 0,
        diasCompensados: 0,
        diasEnfermedad: 0,
        diasSubsidioEnfermedad: 0,
        diasSubsidioMaterno: 0,
        diasLicencia: 0,
        faltas: 0
      },
      {
        codigo: '000020',
        idIdentidad: '10890765',
        apellidosNombres: 'rodri prueba prueta',
        fechaIngreso: new Date(2020, 8, 1),
        estado: 'A',
        dias: 16,
        horas: 0,
        heSimples: 0,
        heDobles: 0,
        he100: 0,
        hNocturnas: 0,
        diasCompensados: 0,
        diasEnfermedad: 0,
        diasSubsidioEnfermedad: 0,
        diasSubsidioMaterno: 0,
        diasLicencia: 0,
        faltas: 15
      }
    ];
  }

  // Acciones de la barra de herramientas
  registrarInasistencia() {
    if (!this.selectedTrabajador) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un trabajador'
      });
      return;
    }
    this.inasistenciaForm = this.createEmptyInasistencia();
    this.displayInasistenciaDialog = true;
  }

  guardarInasistencia() {
    if (!this.validarInasistencia()) {
      return;
    }

    // Aplicar la inasistencia al trabajador seleccionado
    if (this.selectedTrabajador) {
      const diasNoTrabajados = this.inasistenciaForm.diasNoTrabajados;
      
      // Actualizar según el tipo de suspensión
      switch (this.inasistenciaForm.tipoSuspension) {
        case 'FALTA':
          this.selectedTrabajador.faltas += diasNoTrabajados;
          this.selectedTrabajador.dias -= diasNoTrabajados;
          break;
        case 'DESCANSO_MEDICO':
          this.selectedTrabajador.diasEnfermedad += diasNoTrabajados;
          break;
        case 'SUBSIDIO_ENFERMEDAD':
          this.selectedTrabajador.diasSubsidioEnfermedad += diasNoTrabajados;
          break;
        case 'SUBSIDIO_MATERNIDAD':
          this.selectedTrabajador.diasSubsidioMaterno += diasNoTrabajados;
          break;
        case 'LICENCIA_GOCE':
        case 'LICENCIA_SIN_GOCE':
          this.selectedTrabajador.diasLicencia += diasNoTrabajados;
          this.selectedTrabajador.dias -= diasNoTrabajados;
          break;
        case 'VACACIONES':
          this.selectedTrabajador.dias -= diasNoTrabajados;
          break;
        default:
          this.selectedTrabajador.dias -= diasNoTrabajados;
      }

      // Asegurar que los valores no sean negativos
      if (this.selectedTrabajador.dias < 0) this.selectedTrabajador.dias = 0;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Inasistencia registrada correctamente'
    });
    this.displayInasistenciaDialog = false;
  }

  validarInasistencia(): boolean {
    if (!this.inasistenciaForm.tipoSuspension) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un tipo de suspensión'
      });
      return false;
    }
    if (!this.inasistenciaForm.fechaInicio || !this.inasistenciaForm.fechaFin) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar las fechas de inicio y fin'
      });
      return false;
    }
    if (this.inasistenciaForm.fechaInicio > this.inasistenciaForm.fechaFin) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de inicio no puede ser mayor a la fecha fin'
      });
      return false;
    }
    return true;
  }

  calcularDias() {
    if (this.inasistenciaForm.fechaInicio && this.inasistenciaForm.fechaFin) {
      const diffTime = Math.abs(this.inasistenciaForm.fechaFin.getTime() - this.inasistenciaForm.fechaInicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.inasistenciaForm.diasNoTrabajados = diffDays;
    }
  }

  imprimir() {
    if (this.trabajadores.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay datos para imprimir'
      });
      return;
    }
    
    // Simular impresión abriendo ventana de impresión del navegador
    this.messageService.add({
      severity: 'info',
      summary: 'Imprimir',
      detail: 'Preparando documento para impresión...'
    });
    
    setTimeout(() => {
      window.print();
    }, 500);
  }

  vistaPrevia() {
    if (this.trabajadores.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay datos para visualizar'
      });
      return;
    }
    
    // Generar contenido HTML para vista previa
    const contenido = this.generarReporteHTML();
    const ventana = window.open('', '_blank', 'width=800,height=600');
    
    if (ventana) {
      ventana.document.write(contenido);
      ventana.document.close();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Vista Previa',
        detail: 'Abriendo vista previa en nueva ventana...'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo abrir la ventana. Verifique el bloqueador de ventanas emergentes.'
      });
    }
  }

  generarReporteHTML(): string {
    const fecha = new Date().toLocaleDateString('es-PE');
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Asistencia</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #667eea; text-align: center; }
          .info { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background-color: #667eea; color: white; padding: 8px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #ddd; }
          tr:hover { background-color: #f5f5f5; }
          .total { font-weight: bold; background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>REPORTE DE ASISTENCIA</h1>
        <div class="info">
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Total Trabajadores:</strong> ${this.trabajadores.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>DNI</th>
              <th>Apellidos y Nombres</th>
              <th>F.Ingreso</th>
              <th>Estado</th>
              <th>Días</th>
              <th>HE Simples</th>
              <th>HE Dobles</th>
              <th>Faltas</th>
            </tr>
          </thead>
          <tbody>
    `;

    this.trabajadores.forEach(t => {
      html += `
        <tr>
          <td>${t.codigo}</td>
          <td>${t.idIdentidad}</td>
          <td>${t.apellidosNombres}</td>
          <td>${new Date(t.fechaIngreso).toLocaleDateString('es-PE')}</td>
          <td>${this.getEstadoLabel(t.estado)}</td>
          <td>${t.dias}</td>
          <td>${t.heSimples}</td>
          <td>${t.heDobles}</td>
          <td style="color: ${t.faltas > 0 ? 'red' : 'black'}; font-weight: ${t.faltas > 0 ? 'bold' : 'normal'}">${t.faltas}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    return html;
  }

  cancelar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar? Se perderán los cambios no guardados.',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',

      accept: () => {
        this.loadTrabajadores();
        this.selectedTrabajador = null;
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Operación cancelada'
        });
      }
    });
  }

  guardar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea guardar los cambios de asistencia?',
      header: 'Confirmar Guardado',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Se guardaron los datos de ${this.trabajadores.length} trabajadores correctamente`
        });
      }
    });
  }

  eliminar() {
    if (!this.selectedTrabajador) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un trabajador'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro que desea resetear los registros de asistencia de ${this.selectedTrabajador.apellidosNombres}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        if (this.selectedTrabajador) {
          // Resetear valores de asistencia
          this.selectedTrabajador.dias = 31;
          this.selectedTrabajador.horas = 0;
          this.selectedTrabajador.heSimples = 0;
          this.selectedTrabajador.heDobles = 0;
          this.selectedTrabajador.he100 = 0;
          this.selectedTrabajador.hNocturnas = 0;
          this.selectedTrabajador.diasCompensados = 0;
          this.selectedTrabajador.diasEnfermedad = 0;
          this.selectedTrabajador.diasSubsidioEnfermedad = 0;
          this.selectedTrabajador.diasSubsidioMaterno = 0;
          this.selectedTrabajador.diasLicencia = 0;
          this.selectedTrabajador.faltas = 0;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registros de asistencia reseteados correctamente'
          });
        }
      }
    });
  }

  refrescar() {
    this.loadTrabajadores();
    this.selectedTrabajador = null;
    this.globalFilterValue = '';
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Datos actualizados correctamente'
    });
  }

  // Filtro global
  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilterValue = value;
  }

  // Severidad del estado
  getSeverity(estado: string): string {
    switch (estado) {
      case 'A':
        return 'success';
      case 'I':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getEstadoLabel(estado: string): string {
    return estado === 'A' ? 'ACTIVO' : 'INACTIVO';
  }
}