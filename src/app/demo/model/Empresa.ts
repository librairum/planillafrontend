
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