import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { EmpresasxModulo, Login } from '../../model/Login';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, CheckboxModule, RouterModule, FormsModule, DropdownModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
    credencialesFRM: FormGroup;
    errorMessage: string = '';
    showDialog: boolean = false;
    recordarme: boolean = false;
    dialogMessage: string = '';
    Empresa: EmpresasxModulo[] = [];
    selectedEmpresa: string = '';

    // Credenciales hardcodeadas para validación
    private readonly CREDENCIALES_VALIDAS = {
        nombreusuario: 'melissa',
        claveusuario: 'melissa',
        codigoempresa: 'EMP001'
    };

    constructor(
        private fb: FormBuilder,
        private LoginServicio: LoginService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.credencialesFRM = fb.group({
            nombreusuario: ['', [Validators.required, Validators.maxLength(50)]],
            claveusuario: ['', [Validators.required, Validators.maxLength(50)]],
            codigoempresa: ['', [Validators.required, Validators.maxLength(50)]],
        });
    }

    ngOnInit(): void {
        this.LoginServicio.isAuthenticated().subscribe(isAuthenticated => {
            if (isAuthenticated) {
                this.router.navigate(['/home']); // Cambiado a minúscula
            } else {
                this.router.navigate(['/'])
            }
        });

        const savedUser = localStorage.getItem('rememberedUser');
        if (savedUser) {
            const { nombreusuario, claveusuario, codigoempresa } = JSON.parse(savedUser);
            this.credencialesFRM.patchValue({ nombreusuario, claveusuario, codigoempresa });
            this.recordarme = true;
        }
        this.loadEmpresaList();
    }

    // Método modificado para validar con equals
    iniciarSesion() {
        if (this.credencialesFRM.valid) {
            const autenticacion: Login = this.credencialesFRM.value;

            // Validación con equals (comparación directa)
            if (autenticacion.nombreusuario === this.CREDENCIALES_VALIDAS.nombreusuario &&
                autenticacion.claveusuario === this.CREDENCIALES_VALIDAS.claveusuario &&
                autenticacion.codigoempresa === this.CREDENCIALES_VALIDAS.codigoempresa) {
                
                // Autenticación exitosa
                console.log("Autenticación exitosa");

                // Guardar en localStorage para mantener sesión
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('nombreUsuario', autenticacion.nombreusuario);
                localStorage.setItem('codigoEmpresa', autenticacion.codigoempresa);
                localStorage.setItem('codigoPerfil', 'PERFIL001');

                // Guardar credenciales si "Recordarme" está activado
                if (this.recordarme) {
                    localStorage.setItem('rememberedUser', JSON.stringify({
                        nombreusuario: autenticacion.nombreusuario,
                        claveusuario: autenticacion.claveusuario,
                        codigoempresa: autenticacion.codigoempresa,
                    }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                // Mostrar mensaje de éxito
                this.messageService.add({
                    severity: 'success',
                    summary: 'Inicio de sesión exitoso',
                    detail: 'Bienvenido al sistema'
                });

                // Navegar al Home después de un pequeño delay
                setTimeout(() => {
                    this.router.navigate(['/home']); // CAMBIADO A MINÚSCULA
                }, 500);
                
            } else {
                // Credenciales inválidas
                console.log("Error en autenticación");
                this.messageService.add({
                    severity: 'error',
                    summary: 'Credenciales inválidas',
                    detail: 'Usuario y/o clave incorrecta'
                });
            }

        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos incompletos',
                detail: 'Por favor completa los campos correctamente.'
            });
        }
    }

    loadEmpresaList() {
        // Lista hardcodeada de empresas
        this.Empresa = [
            { 
                empresaCod: 'EMP001', 
                nombre: 'PLANILLA',
                codigomodulo: 'MOD001',
                razonSocial: 'Empresa Principal S.A.C.',
                ruc: '20123456789',
                direccion: 'Av. Principal 123, Lima'
            },
        ];
    }

    onEmpresaChallenge(event: any) {
        console.log("Empresa seleccionada:", event.value);
        this.credencialesFRM.patchValue({
            codigoempresa: event.value
        });
    }
}