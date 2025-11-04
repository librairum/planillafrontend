
export interface ResponsablePlanilla {
  encargadoplanilladoctip: string;
  encargadoplanilladocnro: string;
  encargadoplanillaapepaterno: string;
  encargadoplanillaapematerno: string;
  encargadoplanillanombres: string;
}

export interface RepresentanteLegal {
  replegaldoctip: string;
  replegaldocnro: string;
  replegalapepaterno: string;
  replegalapematerno: string;
  replegalnombres: string;
}

export interface Banco {
  ctasolespagobancocod: string;
  ctasolespagonumero: string;
  ctadolarespagobancocod: string;
  ctadolarespagonumero: string;
}

// Entidad Principal Empresa
export interface Empresa {
  empresacod: string;
  ruc: string;
  razonsocial: string;
  direccion: string;

  representanteLegal: RepresentanteLegal;
  responsablePlanilla: ResponsablePlanilla;
  bancos: Banco;
}

export interface Cargo {
  pla51codigo: string;
  pla51descripcion: string;
  pla51flagactivo: boolean;
}

export interface Establecimiento {  
    pla20codigo: string;
    pla20denominacion: string;
    pla20establecimientotipo: string;
    pla20sctrflag: boolean; 
    pla20sctrtasa: number;
}

export interface CentroCosto{
  pla57codigo: string;
  pla57descripcion: string;
  pla57flagactivo: boolean;
}

export interface Calcular{
  pla01empleadocod: string;
  pla01docuidentidadnro: string;
  pla01apepaterno: string;
  pla01apematerno: string;
  pla01nombre1: string;
  pla01nombre2: string;
  pla01fechaingreso: Date;
  pla01centrocostocod: string;
  pla01puestocod: string;

  calculoestado: string;
}