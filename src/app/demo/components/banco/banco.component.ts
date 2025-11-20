import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';

// Importar las interfaces desde el archivo de modelo
import { Banco, BancoView } from 'src/app/demo/model/Banco';

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})
export class BancoComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  bancos: BancoView[] = [];
  originalBanco: BancoView | null = null;
  globalFilterValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBancos();
  }

  loadBancos() {
    this.bancos = [
      { codigo: '01', descripcion: 'BANCO CENTRAL DE RESERVA DEL PERÚ', activo: true },
      { codigo: '02', descripcion: 'BANCO DE CRÉDITO BCP', activo: true },
      { codigo: '03', descripcion: 'BANCO CONTINENTAL BBVA', activo: true },
      { codigo: '04', descripcion: 'BANCO BANBIF', activo: true },
      { codigo: '05', descripcion: 'BANCO SCOTIABANK', activo: true },
      { codigo: '07', descripcion: 'BANCO CITIBANK ', activo: true },
      { codigo: '08', descripcion: 'BANCO INTERBANK', activo: true },
      { codigo: '09', descripcion: 'BANCO DEL TRABAJO', activo: true },
      { codigo: '10', descripcion: 'CAJA MUNICIPAL SULLANA AG.HUARAL', activo: true },
      { codigo: '11', descripcion: 'BANCO FALABELLA PERÚ S.A.', activo: true },
      { codigo: '12', descripcion: 'CAJA RURAL DE AHORRO Y CRÉDITO SEÑOR DE LUREN', activo: true },
      { codigo: '13', descripcion: 'CAJA MUNICIPAL DE AHORRO Y CRÉDITO DE HUANCAYO', activo: true },
      { codigo: '14', descripcion: 'BANCO MIBANCO ', activo: true },
      { codigo: '15', descripcion: 'BANCO MUNICIPAL', activo: false }
    ];
  }

  agregarNuevo() {
    const editing = this.bancos.find(b => b.isEditing || b.isNew);
    if (editing) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual antes de agregar uno nuevo'
      });
      return;
    }

    const nuevoBanco: BancoView = {
      codigo: '',
      descripcion: '',
      activo: true,
      isEditing: true,
      isNew: true
    };

    this.bancos.unshift(nuevoBanco);

    if (this.table) {
      this.table.first = 0;
    }
  }

  editar(banco: BancoView) {
    const editing = this.bancos.find(b => b.isEditing);
    if (editing && editing !== banco) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete o cancele la edición actual'
      });
      return;
    }

    this.originalBanco = { ...banco };
    banco.isEditing = true;
  }

  eliminar(banco: BancoView, index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este banco?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.bancos.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Banco eliminado correctamente'
        });
      }
    });
  }

  cancelar(banco: BancoView, index: number) {
    if (banco.isNew) {
      this.bancos.splice(index, 1);
    } else {
      if (this.originalBanco) {
        banco.codigo = this.originalBanco.codigo;
        banco.descripcion = this.originalBanco.descripcion;
        banco.activo = this.originalBanco.activo;
      }
      banco.isEditing = false;
      this.originalBanco = null;
    }
  }

  guardar(banco: BancoView, index: number) {
    if (!banco.codigo || !banco.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y descripción son obligatorios'
      });
      return;
    }

    if (banco.isNew) {
      const existe = this.bancos.find((b, i) =>
        i !== index && b.codigo === banco.codigo
      );
      if (existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe un banco con este código'
        });
        return;
      }
    }

    banco.isEditing = false;
    banco.isNew = false;
    this.originalBanco = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Banco guardado correctamente'
    });

    const bancoGuardado = this.bancos.splice(index, 1)[0];
    this.bancos.push(bancoGuardado);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilterValue = value;
  }
}
