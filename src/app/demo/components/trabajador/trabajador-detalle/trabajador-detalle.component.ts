/* Milton Garriazo */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TrabajadorService } from 'src/app/demo/service/trabajador.service';

import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';

@Component({
  standalone: true,
  selector: 'app-trabajador-detalle',
  templateUrl: './trabajador-detalle.component.html',
  styleUrls: ['./trabajador-detalle.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class TrabajadorDetalleComponent implements OnInit{
  trabajadorForm: FormGroup;
  isNewRecord: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService
  ) {
    this.trabajadorForm = this.fb.group({

    });
  }

  initForm(){
    this.trabajadorForm = this.fb.group({
          pla01empresacod: ['', Validators.required],
          pla01empleadocod: ['', Validators.required], //pk
          pla01planillacod: [''],
          pla01docuidentidadtipo: [''],
          pla01docuidentidadnro: [''],

          pla01apepaterno: [''],
          pla01apematerno: [''],
          pla01nombre1: [''],
          pla01nombre2: [''],
          pla01direccion: [''],
          pla01fechanacimiento: null,
          pla01telefono: [''],
          pla01fechaingreso: null,
          pla01centrocostocod: [''],

          //ocultos

          pla01fechacese: null,
          pla01sexo: [''],
          pla01estado: [''],

          pla01puestocod: [''],
          pla01ctaremunbancocod: [''],
          pla01ctaremunumero: [''],
          pla01ctaremunmoneda: [''],

          pla01trdatoslabregimenlaboral: [''],
          labregimenlaboraldes: [''],

          tipdocdesc: [''],

          remuneraciones: this.fb.array([]),
          regimenespensionarios: this.fb.array([]),
          periodoslaborales: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const empresaId = this.route.snapshot.paramMap.get('empresaId'); // Obtiene el ID de la empresa
      const empleadoId = this.route.snapshot.paramMap.get('empleadoId'); // Obtiene el ID del empleado
    if (empresaId && empleadoId) {
      this.cargarTrabajador(empresaId, empleadoId); // Carga los datos del trabajador
    }
  }

  cargarTrabajador(idempresa: string, idempleado: string): void {
    this.trabajadorService.GetTrabajadorById(idempresa, idempleado).subscribe({
      next: (trabajador) => {
        if(trabajador)
        this.trabajadorForm.patchValue(trabajador);
      },
      error: (error) => {
        console.error('Error al cargar el trabajador:', error);
        verMensajeInformativo(
          this.messageService, 'error', 'Error', `No se pudo cargar la información del trabajador: ${error.message}`
        );
      }
    });
  }
}
