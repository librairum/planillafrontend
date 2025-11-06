/* Milton Garriazo */

export interface Concepto {
  pla10empresacod: string;
  pla10conceptocod: string;
  pla10conceptodesc: string;
  pla10conceptoalias: string;
  pla10flagclase: string;
  pla10flagimpresion: string;
  pla10flagactivo: string;
  pla10flagconfigurable: string;
  pla10tipoconceptocod: string;
  pla10subtipoconceptocod: string;
  pla10tipocalculocod: string;
  pla10conceptosunatcod: string;
  pla10formula: string;
  pla10formulaalias: string;
  pla10comentario: string;
  pla10flagestandar: string;
  pla10conceptopadrecod: string;

  pla10flagestandardesc?: string;

  conceptotipodesc?: string;
  conceptosubtipodesc?: string;
  calculotipodesc?: string;
  conceptosunatdesc?: string;

  //esto era opcional, pero por errores lo estoy poniendo obligatorio
  afectacionesSunat: AfectacionSunat[];
  afectacionOtros: AfectacionOtros[];
  planillasAsignadas: PlanillaAsignada[];
  regimenesLaborales: RegimenLaboral[];
}

/*
pla10empresacod text COLLATE pg_catalog."default" NOT NULL,
    pla10conceptocod text COLLATE pg_catalog."default" NOT NULL,
    pla10conceptodesc text COLLATE pg_catalog."default",
    pla10conceptoalias text COLLATE pg_catalog."default",
    pla10flagclase text COLLATE pg_catalog."default",
    pla10flagimpresion text COLLATE pg_catalog."default",
    pla10flagactivo text COLLATE pg_catalog."default",
    pla10flagconfigurable text COLLATE pg_catalog."default",
    pla10tipoconceptocod text COLLATE pg_catalog."default",
    pla10subtipoconceptocod text COLLATE pg_catalog."default",
    pla10tipocalculocod text COLLATE pg_catalog."default",
    pla10conceptosunatcod text COLLATE pg_catalog."default",
    pla10formula text COLLATE pg_catalog."default",
    pla10formulaalias text COLLATE pg_catalog."default",
    pla10comentario text COLLATE pg_catalog."default",
    pla10flagestandar text COLLATE pg_catalog."default",
    pla10conceptopadrecod text COLLATE pg_catalog."default",

    Pla10EmpresaCod TEXT, //Pla10Concepto
    Pla10ConceptoCod TEXT, //Pla10Concepto
    Pla10ConceptoDesc TEXT, //Pla10Concepto
    Pla10ConceptoAlias TEXT, //Pla10Concepto
    Pla10FlagClase TEXT, //Pla10Concepto
    Pla10FlagImpresion TEXT, //Pla10Concepto
    Pla10FlagActivo TEXT, //Pla10Concepto
    Pla10FlagConfigurable TEXT, //Pla10Concepto
    Pla10TipoConceptoCod TEXT, //Pla10Concepto
    Pla10SubTipoConceptoCod TEXT, //Pla10Concepto
    Pla10TipoCalculoCod TEXT, //Pla10Concepto
    Pla10ConceptoSunatCod TEXT, //Pla10Concepto
    Pla10FlagEstandarDesc TEXT, //Pla10Concepto
    ConceptoPadreCod TEXT //Pla10Concepto

    ConceptoTipoDesc TEXT, //Pla50ConceptoTipo
    ConceptoSubTipoDesc TEXT, //Pla51ConceptoSubTipo
    CalculoTipoDesc TEXT, //Pla52CalculoTipo
    ConceptoSunatDesc TEXT //Glo01ConceptosSunat

    (CASE COALESCE(c.Pla10FlagEstandar, 'E')
            WHEN '' THEN 'No Especificado'
            WHEN 'E' THEN 'Estandar'
            WHEN 'P' THEN 'Personalizado'
            ELSE 'No Especificado'
        END),

    */

export interface TipoCalculo {
  codigo: string;
  descripcion: string;
}

export interface ConceptoTipo {
  codigo: string;
  descripcion: string;
}

export interface SubTipoConcepto {
  conceptoTipoCod: string;
  codigo: string;
  descripcion: string;
}

export interface ConceptoSunat {
  codigoSunat: string;
  descripcion: string;
}
export interface AfectacionSunat {
  codigo: string;
  descripcion: string;
  valor: boolean;
}
export interface AfectacionOtros {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

export interface PlanillaAsignada {
  codigo: string;
  descripcion: string;
  valor: boolean;
}

export interface RegimenLaboral {
  codigo: string;
  descripcion: string;
  valor: boolean;
}
