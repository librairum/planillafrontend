
export interface ResponsablePlanilla {
  EncargadoPlanillaDocTip: string;
  EncargadoPlanillaDocNro: string;
  EncargadoPlanillaApePaterno: string;
  EncargadoPlanillaApeMaterno: string;
  EncargadoPlanillaNombres: string;
}

export interface RepresentanteLegal {
  RepLegalDocTip: string;
  RepLegalDocNro: string;
  RepLegalApePaterno: string;
  RepLegalApeMaterno: string;
  RepLegalNombres: string;
}

export interface Banco {
  CtaSolesPagoBancoCod: string;
  CtaSolesPagoNumero: string;
  CtaDolaresPagoBancoCod: string;
  CtaDolaresPagoNumero: string;
}

// Entidad Principal Empresa
export interface Empresa {
  EmpresaCod: string;
  RUC: string;
  RazonSocial: string;
  Direccion: string;

  representanteLegal: RepresentanteLegal;
  responsablePlanilla: ResponsablePlanilla;
  bancos: Banco;
}