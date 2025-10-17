// src/app/demo/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  codigoEmpresa: string = '';
  fechaSeleccionada: string = '';
  menuVisible: boolean = true;
  menuItems: MenuItem[] = [];
  mostrarBienvenida: boolean = true;

  

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    this.codigoEmpresa = localStorage.getItem('codigoEmpresa') || '';
    
    const fecha = new Date();
    this.fechaSeleccionada = `${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

    this.initializeMenu();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('URL actual:', event.url);
      this.mostrarBienvenida = event.url === '/home' || event.url === '/home/';
    });
  }

  initializeMenu(): void {
    this.menuItems = [
      {
        label: 'Sistema',
        icon: 'pi pi-fw pi-cog',
        expanded: true,
        items: [
          {
            label: 'Procesos',
            icon: 'pi pi-fw pi-refresh',
            items: [
              { label: 'Asistente Calcular Planilla', icon: 'pi pi-fw pi-calculator', command: () => this.navegarA('sistema/procesos/calcular-planilla') },
              { label: 'Periodo Pago', icon: 'pi pi-fw pi-calendar', command: () => this.navegarA('sistema/procesos/periodo-pago') },
              { label: 'Asistencia', icon: 'pi pi-fw pi-clock', command: () => this.navegarA('sistema/procesos/asistencia') },
              { label: 'Calcular', icon: 'pi pi-fw pi-calculator', command: () => this.navegarA('sistema/procesos/calcular') },
              { label: 'AFP Tasas y comisiones', icon: 'pi pi-fw pi-percentage', command: () => this.navegarA('sistema/procesos/afp-tasas') },
              { label: 'Asistente de empresa', icon: 'pi pi-fw pi-building', command: () => this.navegarA('sistema/procesos/asistente-empresa') },
              { label: 'Configuración boleta', icon: 'pi pi-fw pi-cog', command: () => this.navegarA('sistema/procesos/config-boleta') }
            ]
          },
          {
            label: 'Interfaces',
            icon: 'pi pi-fw pi-share-alt',
            items: [
              { label: 'Transferencia Bancaria', icon: 'pi pi-fw pi-money-bill', command: () => this.navegarA('sistema/interfaces/transferencia') },
              { label: 'PDT Plame', icon: 'pi pi-fw pi-file-pdf', command: () => this.navegarA('sistema/interfaces/pdt-plame') },
              { label: 'AFP Net', icon: 'pi pi-fw pi-globe', command: () => this.navegarA('sistema/interfaces/afp-net') },
              { label: 'Asiento Contable', icon: 'pi pi-fw pi-book', command: () => this.navegarA('sistema/interfaces/asiento-contable') }
            ]
          },
          {
            label: 'Maestros',
            icon: 'pi pi-fw pi-database',
            items: [
              { label: 'Trabajador', icon: 'pi pi-fw pi-user', command: () => this.navegarA('maestros/trabajador') },
              { label: 'Concepto', icon: 'pi pi-fw pi-tag', command: () => this.navegarA('maestros/concepto') },
              { label: 'Empresa', icon: 'pi pi-fw pi-building', command: () => this.navegarA('maestros/empresa') },
              { label: 'Establecimiento', icon: 'pi pi-fw pi-home', command: () => this.navegarA('maestros/establecimiento') },
              { label: 'Cargo', icon: 'pi pi-fw pi-briefcase', command: () => this.navegarA('maestros/cargo') },
              { label: 'Centro de costo', icon: 'pi pi-fw pi-dollar', command: () => this.navegarA('maestros/centro-costo') },
              { label: 'Parametros general', icon: 'pi pi-fw pi-sliders-h', command: () => this.navegarA('maestros/parametros-general') },
              { label: 'Parametros por Empresa', icon: 'pi pi-fw pi-sliders-v', command: () => this.navegarA('maestros/parametros-empresa') },
              { label: 'Plantilla Asistencia', icon: 'pi pi-fw pi-table', command: () => this.navegarA('maestros/plantilla-asistencia') },
              { label: 'Regimen pensionario', icon: 'pi pi-fw pi-shield', command: () => this.navegarA('maestros/regimen-pensionario') },
              { label: 'Banco', icon: 'pi pi-fw pi-building', command: () => this.navegarA('maestros/banco') },
              { label: 'Base afectacion', icon: 'pi pi-fw pi-chart-line', command: () => this.navegarA('maestros/base-afectacion') },
              { label: 'Planilla tipo', icon: 'pi pi-fw pi-list', command: () => this.navegarA('maestros/planilla-tipo') },
              { label: 'Planilla grupo', icon: 'pi pi-fw pi-users', command: () => this.navegarA('maestros/planilla-grupo') },
              { label: 'Sub Tipo planilla', icon: 'pi pi-fw pi-sitemap', command: () => this.navegarA('maestros/sub-tipo-planilla') },
              { label: 'Apertura de año', icon: 'pi pi-fw pi-calendar-plus', command: () => this.navegarA('maestros/apertura-ano') }
            ]
          },
          {
            label: 'Maestro Estandar',
            icon: 'pi pi-fw pi-star',
            items: [
              { label: 'Concepto Estandar', icon: 'pi pi-fw pi-tag', command: () => this.navegarA('maestro-estandar/concepto') },
              { label: 'Configuracion boleta estandar', icon: 'pi pi-fw pi-cog', command: () => this.navegarA('maestro-estandar/config-boleta') },
              { label: 'Apertura de año Estandar', icon: 'pi pi-fw pi-calendar-plus', command: () => this.navegarA('maestro-estandar/apertura-ano') }
            ]
          },
          {
            label: 'Reporte',
            icon: 'pi pi-fw pi-chart-bar',
            items: [
              { label: 'Remuneracion Anual', icon: 'pi pi-fw pi-chart-line', command: () => this.navegarA('reporte/remuneracion-anual') }
            ]
          },
          {
            label: 'Seguridad',
            icon: 'pi pi-fw pi-shield',
            items: [
              { label: 'Usuarios', icon: 'pi pi-fw pi-users', command: () => this.navegarA('seguridad/usuarios') }
            ]
          },
          {
            label: 'Utilitarios',
            icon: 'pi pi-fw pi-wrench',
            items: [
              { label: 'Generar Backup BD', icon: 'pi pi-fw pi-save', command: () => this.navegarA('utilitarios/backup') },
              { label: 'Restaurar BD', icon: 'pi pi-fw pi-replay', command: () => this.navegarA('utilitarios/restaurar') }
            ]
          }
        ]
      },
      {
        label: 'Salir',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.cerrarSesion()
      }
    ];
  }

  // ✅ MÉTODO CORREGIDO
  navegarA(ruta: string): void {
    console.log('Navegando a:', ruta);
    this.router.navigateByUrl(`/home/${ruta}`);
  }

  cerrarSesion(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('codigoEmpresa');
    localStorage.removeItem('codigoPerfil');
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

navegarAHome(): void {
  this.router.navigate(['/home']);
}
}