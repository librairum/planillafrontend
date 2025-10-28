import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

// Importaciones de PrimeNG
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple'; 
import { TableModule } from 'primeng/table'; 
import { ToastModule } from 'primeng/toast'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

// Servicios de PrimeNG
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

// *************************************************************************
// NOTA: Para que este código sea ejecutable en un entorno de prueba, 
// asumo que estas importaciones son válidas y que las funciones utilitarias
// (esVacio, aMayusculas, verMensajeInformativo) existen y funcionan.
// Si las dependencias no están disponibles, el compilador podría fallar.
// *************************************************************************
import { Establecimiento } from 'src/app/demo/model/Establecimiento'; 
import { 
  verMensajeInformativo, 
  esVacio, 
  aMayusculas 
} from 'src/app/demo/components/utilities/funciones_utilitarias'; 

@Component({
  selector: 'app-establecimiento',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CheckboxModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    DropdownModule,
    RippleModule,
    TableModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService], 
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.css']
})

export class EstablecimientoComponent implements OnInit {
  
  // Objeto en edición o vista, ahora usando la interfaz importada
  establecimiento: Establecimiento = this.initializeEstablecimiento();
  currentEstablecimientoCodigo: string = ''; 

  // Lista de establecimientos para la tabla
  establecimientos: Establecimiento[] = []; 
  rowsPerPage: number = 10; 

  // ELIMINADO: isViewMode: boolean = true; 
  isAddMode: boolean = false; 
  isEditMode: boolean = false; 

  // Objeto que mantiene la data de la fila que se está editando en línea
  editingEstablecimiento: Establecimiento | null = null; 

  // Opciones para combobox (Tipo de Establecimiento, basado en tu imagen)
  tipoOptions = [
    { label: 'DOMICILIO FISCAL', value: '00' },
    { label: 'CASA MATRIZ', value: '01' },
    { label: 'SUCURSAL', value: '02' },
    { label: 'AGENCIA', value: '03' },
    { label: 'LOCAL COMERCIAL O DE SERVICIOS', value: '04' },
    { label: 'SEDE PRODUCTIVA', value: '05' },
    { label: 'DEPÓSITO (ALMACÉN)', value: '06' },
  ];
  
  // Data simulada
  currentEstablecimientos: Establecimiento[] = [ 
    {
      pla20codigo: '0000',
      pla20denominacion: 'OFICINA PRINCIPAL - LIMA',
      pla20establecimientotipo: '00', // Domicilio Fiscal
      pla20sctrflag: false,
      pla20sctrtasa: null as any, 
    },
    {
      pla20codigo: '0001',
      pla20denominacion: 'ALMACÉN CALLAO',
      pla20establecimientotipo: '06', // Depósito
      pla20sctrflag: true,
      pla20sctrtasa: 15.5,
    },
  ];

  // Se mantiene, aunque ya no se usa para edición/eliminación desde la tabla.
  selectedEstablecimiento: Establecimiento | null = null; 

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // Carga inicial de datos simulados
    this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos)); 
  }

  private initializeEstablecimiento(): Establecimiento {
    return {
      pla20codigo: '', 
      pla20denominacion: '', 
      pla20sctrflag: false, 
      pla20sctrtasa: null as any, 
      pla20establecimientotipo: ''
    };
  }

  // --- Métodos de Control de UI ---

  agregarEstablecimiento(): void {
    if (this.editingEstablecimiento) {
      verMensajeInformativo(this.messageService, 'warn', 'Advertencia', 'Finalice la edición actual antes de agregar un nuevo registro.');
      return;
    }
    
    // 1. Crear un nuevo establecimiento vacío con un código temporal único 
    const newEstablecimiento: Establecimiento = {
        ...this.initializeEstablecimiento(),
        // Usamos un código temporal para identificar que es una fila nueva
        pla20codigo: `NEW-${Date.now()}` 
    };

    // 2. Insertarlo al inicio de la lista de establecimientos visibles
    this.establecimientos.unshift(newEstablecimiento);

    // 3. Clonarlo y asignarlo a editingEstablecimiento para activar el modo de edición en línea
    this.editingEstablecimiento = JSON.parse(JSON.stringify(newEstablecimiento));

    // 4. Establecer el modo adición
    this.isAddMode = true; 
    this.isEditMode = false;

    this.establecimiento = this.initializeEstablecimiento(); 
    this.selectedEstablecimiento = null;
  }

  cancelar(): void {
    // Cancela el modo de Adición (formulario inferior, ahora redundante)
    this.isAddMode = false;
    this.isEditMode = false;

    this.establecimiento = this.initializeEstablecimiento();
    this.selectedEstablecimiento = null;
  }

  // --- Lógica de Edición en Línea (INLINE EDITING) ---

  /** Inicia la edición en línea para la fila seleccionada. */
  onRowEditarEstablecimiento(establecimiento: Establecimiento): void {
      if (this.editingEstablecimiento !== null) {
          verMensajeInformativo(this.messageService, 'warn', 'Atención', 'Ya hay una fila en edición. Cancele o guarde primero.');
          return;
      }
      // Clonamos profundamente el objeto para evitar modificar la tabla directamente
      this.editingEstablecimiento = JSON.parse(JSON.stringify(establecimiento));
      this.isEditMode = true; 
      this.isAddMode = false; 
  }

  onRowCancelarEdicion(establecimiento: Establecimiento): void {
      if (this.isAddMode) {
        // Si estábamos en modo 'AddMode', eliminamos la fila temporal de la lista visible
        this.establecimientos = this.establecimientos.filter(e => e.pla20codigo !== establecimiento.pla20codigo);
      }
      
      // Limpiamos el objeto de edición para RE-HABILITAR el botón "Agregar"
      this.editingEstablecimiento = null;
      this.isEditMode = false; 
      this.isAddMode = false;
      
      // Aseguramos que la lista visible refleje la lista principal después de la limpieza
      this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos));
  }

  /** Función auxiliar de validación para el objeto de edición en línea. */
  onRowValidarCampos(establecimiento: Establecimiento): boolean {
    
    // Si estamos AGREGANDO una nueva fila, el código es editable y debe validarse
    if (this.isAddMode) {
        if (esVacio(establecimiento.pla20codigo) || establecimiento.pla20codigo.startsWith('NEW-')) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código (pla20codigo) es obligatorio para el nuevo registro.');
            return false;
        }

        // Validación de duplicados para el código
        if (this.currentEstablecimientos.some(e => e.pla20codigo === establecimiento.pla20codigo)) {
            verMensajeInformativo(this.messageService, 'error', 'Error', `El Código ${establecimiento.pla20codigo} ya existe.`);
            return false;
        }
    }

    if (esVacio(establecimiento.pla20denominacion)) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'La Denominación (pla20denominacion) es obligatoria.');
        return false;
    }

    if (esVacio(establecimiento.pla20establecimientotipo)) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'El Tipo de Establecimiento es obligatorio.');
        return false;
    }
    
    // Validación SCRT y Tasa
    if (establecimiento.pla20sctrflag) {
        if (establecimiento.pla20sctrtasa === null || establecimiento.pla20sctrtasa === undefined || establecimiento.pla20sctrtasa <= 0) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Si SCRT está marcado, la Tasa debe ser un valor positivo.');
            return false;
        }
    }

    return true; 
  }

  /** Guarda los cambios realizados en la fila en edición. */
  onRowGuardarEdicion(original: Establecimiento): void {
      const edited = this.editingEstablecimiento;
      if (!edited) return;

      if (!this.onRowValidarCampos(edited)) {
          return;
      }

      // Estandarización y consistencia
      edited.pla20denominacion = aMayusculas(edited.pla20denominacion);
      edited.pla20codigo = edited.pla20codigo.toUpperCase(); // Estandarizar código al guardar
      
      // Si SCRT no está marcado, la tasa debe ser null
      if (!edited.pla20sctrflag) {
          edited.pla20sctrtasa = null as any;
      }
      
      let mensajeExito = '';

      // Lógica de Búsqueda y Actualización/Adición
      if (this.isAddMode) {
          this.establecimientos = this.establecimientos.filter(e => e.pla20codigo !== original.pla20codigo);

          // 2. Agregar el nuevo establecimiento guardado al array principal de datos
          this.currentEstablecimientos.push(JSON.parse(JSON.stringify(edited))); 
          mensajeExito = 'Establecimiento agregado exitosamente en línea.';

      } else {
          // *** EDITAR ESTABLECIMIENTO EXISTENTE ***
          const index = this.currentEstablecimientos.findIndex(e => e.pla20codigo === original.pla20codigo);

          if (index > -1) {
            // Reemplazamos el objeto original con la versión editada y estandarizada
            this.currentEstablecimientos[index] = JSON.parse(JSON.stringify(edited));
            mensajeExito = 'Cambios guardados exitosamente en línea.';
          } else {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'No se encontró el registro original para actualizar.');
            // Revertir el estado de la tabla si falló la actualización
            this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos)); 
            this.onRowCancelarEdicion(original); 
            return;
          }
      }

      // Refrescar la tabla y notificar
      this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos)); 
      
      verMensajeInformativo(this.messageService, 'success', 'Éxito', mensajeExito);

      // ******* FIX: Limpiar el estado de edición manualmente *******
      this.editingEstablecimiento = null;
      this.isEditMode = false;
      this.isAddMode = false;
      // No se llama a onRowCancelarEdicion para evitar la lógica de descarte.
  }

  
  validarCampos(): boolean {
    // Validaciones para el antiguo formulario (mantenido por si acaso)
    if (esVacio(this.establecimiento.pla20codigo)) {
      verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código  es obligatorio.');
      return false;
    }
    
    if (esVacio(this.establecimiento.pla20denominacion)) {
      verMensajeInformativo(this.messageService, 'error', 'Error', 'La Denominación es obligatoria.');
      return false;
    }

    if (esVacio(this.establecimiento.pla20establecimientotipo)) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'El Tipo de Establecimiento  es obligatorio.');
        return false;
    }
    
    // Validación SCRT y Tasa
    if (this.establecimiento.pla20sctrflag) {
      if (this.establecimiento.pla20sctrtasa === null || this.establecimiento.pla20sctrtasa === undefined || this.establecimiento.pla20sctrtasa <= 0) {
          verMensajeInformativo(this.messageService, 'error', 'Error', 'La Tasa de SCRT es obligatoria y debe ser mayor a 0.');
          return false;
      }
    } else {
      this.establecimiento.pla20sctrtasa = null as any; 
    }

    return true; 
  }
  guardar(): void {
    if (this.isAddMode || this.isEditMode) {
        this.cancelar();
    }
  }

  /** Elimina un establecimiento. Recibe el objeto directamente desde la tabla. */
  eliminarEstablecimiento(establecimiento: Establecimiento): void {
    if (this.editingEstablecimiento !== null) {
      verMensajeInformativo(this.messageService, 'warn', 'Atención', 'Finalice la edición actual antes de eliminar.');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el establecimiento ${establecimiento.pla20codigo} - ${establecimiento.pla20denominacion}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',

      accept: () => {
          const codigoAeliminar = establecimiento.pla20codigo; 
          const initialLength = this.currentEstablecimientos.length;
          
          // 1. Filtrar la lista principal (currentEstablecimientos)
          this.currentEstablecimientos = this.currentEstablecimientos.filter(e => e.pla20codigo !== codigoAeliminar);

          if (this.currentEstablecimientos.length < initialLength) {
            // 2. Actualizar la lista visible (establecimientos) con una nueva referencia, forzando la actualización de la tabla.
            this.establecimientos = JSON.parse(JSON.stringify(this.currentEstablecimientos)); 
            verMensajeInformativo(this.messageService, 'success', 'Éxito', `Establecimiento ${codigoAeliminar} eliminado.`);
          } else {
            verMensajeInformativo(this.messageService, 'error', 'Error', `No se encontró el establecimiento ${codigoAeliminar} para eliminar.`);
          }
      }
    });
  }

  // Método auxiliar para obtener la descripción del tipo de establecimiento en la tabla
  getEstablecimientoTipoLabel(value: string): string {
    return this.tipoOptions.find(option => option.value === value)?.label || '';
  }
}
