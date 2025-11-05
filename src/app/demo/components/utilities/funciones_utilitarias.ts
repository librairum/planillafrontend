// src/app/demo/components/utilities/funciones_utilitarias.ts

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
    if (messageService) {
        messageService.add({
            severity: severity,
            summary: summary,
            detail: detail,
            life: life
        });
    } else {
        console.warn(`Mensaje (${severity}): ${summary} - ${detail}`);
    }
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

export function esFechaValida(fecha: any): boolean {
    // Comprueba que no sea null/undefined y que sea un objeto Date válido
    return fecha && fecha instanceof Date && !isNaN(fecha.getTime());
}

// Función para formatear fecha a string
export function formatearFecha(fecha: Date | null | undefined): string {
    if (!fecha) return '';
    // Es necesario asegurar que es un objeto Date válido para getDate(), getMonth(), etc.
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return ''; 
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Función para validar RUC peruano (11 dígitos)
export function validarRUC(ruc: string | null | undefined): boolean {
    if (!ruc || typeof ruc !== 'string' || ruc.length !== 11) return false;
    return /^\d{11}$/.test(ruc);
}

// Función para validar DNI peruano (8 dígitos)
export function validarDNI(dni: string | null | undefined): boolean {
    if (!dni || typeof dni !== 'string' || dni.length !== 8) return false;
    return /^\d{8}$/.test(dni);
}

// Función para convertir a mayúsculas
export function aMayusculas(texto: string | null | undefined): string {
    return texto ? texto.toUpperCase() : '';
}

// Función para convertir a minúsculas
export function aMinusculas(texto: string | null | undefined): string {
    return texto ? texto.toLowerCase() : '';
}
