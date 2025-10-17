// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './demo/components/home/home.component';
import { LoginComponent } from './demo/components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      // SISTEMA - PROCESOS
      { 
        path: 'sistema/procesos/calcular-planilla', 
        loadComponent: () => import('./demo/components/calcular-planilla/calcular-planilla.component')
          .then(m => m.CalcularPlanillaComponent)
      },
      { 
        path: 'sistema/procesos/periodo-pago', 
        loadComponent: () => import('./demo/components/periodo-pago/periodo-pago.component')
          .then(m => m.PeriodoPagoComponent)
      },
      { 
        path: 'sistema/procesos/asistencia', 
        loadComponent: () => import('./demo/components/asistencia/asistencia.component')
          .then(m => m.AsistenciaComponent)
      },
      { 
        path: 'sistema/procesos/calcular', 
        loadComponent: () => import('./demo/components/calcular/calcular.component')
          .then(m => m.CalcularComponent)
      },
      { 
        path: 'sistema/procesos/afp-tasas', 
        loadComponent: () => import('./demo/components/afp-tasas/afp-tasas.component')
          .then(m => m.AfpTasasComponent)
      },
      { 
        path: 'sistema/procesos/asistente-empresa', 
        loadComponent: () => import('./demo/components/asistente-empresa/asistente-empresa.component')
          .then(m => m.AsistenteEmpresaComponent)
      },
      { 
        path: 'sistema/procesos/config-boleta', 
        loadComponent: () => import('./demo/components/config-boleta/config-boleta.component')
          .then(m => m.ConfigBoletaComponent)
      },

      // SISTEMA - INTERFACES
      { 
        path: 'sistema/interfaces/transferencia', 
        loadComponent: () => import('./demo/components/transferencia-bancaria/transferencia-bancaria.component')
          .then(m => m.TransferenciaBancariaComponent)
      },
      { 
        path: 'sistema/interfaces/pdt-plame', 
        loadComponent: () => import('./demo/components/pdt-plame/pdt-plame.component')
          .then(m => m.PdtPlameComponent)
      },
      { 
        path: 'sistema/interfaces/afp-net', 
        loadComponent: () => import('./demo/components/afp-net/afp-net.component')
          .then(m => m.AfpNetComponent)
      },
      { 
        path: 'sistema/interfaces/asiento-contable', 
        loadComponent: () => import('./demo/components/asiento-contable/asiento-contable.component')
          .then(m => m.AsientoContableComponent)
      },

      // MAESTROS
      { 
        path: 'maestros/trabajador', 
        loadComponent: () => import('./demo/components/trabajador/trabajador.component')
          .then(m => m.TrabajadorComponent)
      },
      { 
        path: 'maestros/concepto', 
        loadComponent: () => import('./demo/components/concepto/concepto.component')
          .then(m => m.ConceptoComponent)
      },
      { 
        path: 'maestros/empresa', 
        loadComponent: () => import('./demo/components/empresa/empresa.component')
          .then(m => m.EmpresaComponent)
      },
      { 
        path: 'maestros/establecimiento', 
        loadComponent: () => import('./demo/components/establecimiento/establecimiento.component')
          .then(m => m.EstablecimientoComponent)
      },
      { 
        path: 'maestros/cargo', 
        loadComponent: () => import('./demo/components/cargo/cargo.component')
          .then(m => m.CargoComponent)
      },
      { 
        path: 'maestros/centro-costo', 
        loadComponent: () => import('./demo/components/centro-costo/centro-costo.component')
          .then(m => m.CentroCostoComponent)
      },
      { 
        path: 'maestros/parametros-general', 
        loadComponent: () => import('./demo/components/parametros-general/parametros-general.component')
          .then(m => m.ParametrosGeneralComponent)
      },
      { 
        path: 'maestros/parametros-empresa', 
        loadComponent: () => import('./demo/components/parametros-empresa/parametros-empresa.component')
          .then(m => m.ParametrosEmpresaComponent)
      },
      { 
        path: 'maestros/plantilla-asistencia', 
        loadComponent: () => import('./demo/components/plantilla-asistencia/plantilla-asistencia.component')
          .then(m => m.PlantillaAsistenciaComponent)
      },
      { 
        path: 'maestros/regimen-pensionario', 
        loadComponent: () => import('./demo/components/regimen-pensionario/regimen-pensionario.component')
          .then(m => m.RegimenPensionarioComponent)
      },
      { 
        path: 'maestros/banco', 
        loadComponent: () => import('./demo/components/banco/banco.component')
          .then(m => m.BancoComponent)
      },
      { 
        path: 'maestros/base-afectacion', 
        loadComponent: () => import('./demo/components/base-afectacion/base-afectacion.component')
          .then(m => m.BaseAfectacionComponent)
      },
      { 
        path: 'maestros/planilla-tipo', 
        loadComponent: () => import('./demo/components/planilla-tipo/planilla-tipo.component')
          .then(m => m.PlanillaTipoComponent)
      },
      { 
        path: 'maestros/planilla-grupo', 
        loadComponent: () => import('./demo/components/planilla-grupo/planilla-grupo.component')
          .then(m => m.PlanillaGrupoComponent)
      },
      { 
        path: 'maestros/sub-tipo-planilla', 
        loadComponent: () => import('./demo/components/sub-tipo-planilla/sub-tipo-planilla.component')
          .then(m => m.SubTipoPlanillaComponent)
      },
      { 
        path: 'maestros/apertura-ano', 
        loadComponent: () => import('./demo/components/apertura-ano/apertura-ano.component')
          .then(m => m.AperturaAnoComponent)
      },

      // MAESTRO ESTANDAR
      { 
        path: 'maestro-estandar/concepto', 
        loadComponent: () => import('./demo/components/concepto-estandar/concepto-estandar.component')
          .then(m => m.ConceptoEstandarComponent)
      },
      { 
        path: 'maestro-estandar/config-boleta', 
        loadComponent: () => import('./demo/components/config-boleta-estandar/config-boleta-estandar.component')
          .then(m => m.ConfigBoletaEstandarComponent)
      },
      { 
        path: 'maestro-estandar/apertura-ano', 
        loadComponent: () => import('./demo/components/apertura-ano-estandar/apertura-ano-estandar.component')
          .then(m => m.AperturaAnoEstandarComponent)
      },

      // REPORTE
      { 
        path: 'reporte/remuneracion-anual', 
        loadComponent: () => import('./demo/components/remuneracion-anual/remuneracion-anual.component')
          .then(m => m.RemuneracionAnualComponent)
      },

      // SEGURIDAD
      { 
        path: 'seguridad/usuarios', 
        loadComponent: () => import('./demo/components/usuarios/usuarios.component')
          .then(m => m.UsuariosComponent)
      },

      // UTILITARIOS
      { 
        path: 'utilitarios/backup', 
        loadComponent: () => import('./demo/components/backup/backup.component')
          .then(m => m.BackupComponent)
      },
      { 
        path: 'utilitarios/restaurar', 
        loadComponent: () => import('./demo/components/restaurar/restaurar.component')
          .then(m => m.RestaurarComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }