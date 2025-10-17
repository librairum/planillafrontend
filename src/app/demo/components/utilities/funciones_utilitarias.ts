// funciones_utilitarias.ts
// Ruta: src/app/demo/components/utilities/funciones_utilitarias.ts

import { MessageService } from 'primeng/api';

// Interfaz para la respuesta base de la API
export interface RespuestaAPIBase<T = any> {
    isSuccess: boolean;
    message: string;
    data: T;
    errors?: string[];
}

// Alias para respuestas que devuelven arrays
export type RespuestaAPIArray<T> = RespuestaAPIBase<T[]>;

// Función para mostrar mensajes informativos usando PrimeNG Toast
export function verMensajeInformativo(
    messageService: MessageService,
    severity: 'success' | 'info' | 'warn' | 'error',
    summary: string,
    detail: string,
    life: number = 3000
): void {
    messageService.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: life
    });
}

// Función para limpiar campos de un formulario
export function limpiarFormulario(form: any): void {
    if (form) {
        form.reset();
    }
}

// Función para validar si un string está vacío o es null
export function esVacio(valor: string | null | undefined): boolean {
    return !valor || valor.trim().length === 0;
}

// Función para formatear fecha a string
export function formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Función para validar RUC peruano (11 dígitos)
export function validarRUC(ruc: string): boolean {
    if (!ruc || ruc.length !== 11) return false;
    return /^\d{11}$/.test(ruc);
}

// Función para validar DNI peruano (8 dígitos)
export function validarDNI(dni: string): boolean {
    if (!dni || dni.length !== 8) return false;
    return /^\d{8}$/.test(dni);
}

// Función para convertir a mayúsculas
export function aMayusculas(texto: string): string {
    return texto ? texto.toUpperCase() : '';
}

// Función para convertir a minúsculas
export function aMinusculas(texto: string): string {
    return texto ? texto.toLowerCase() : '';
}