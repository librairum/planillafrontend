export interface RegistroCobro
{
    ban03Empresa : string;
    ban03Anio:string;
    ban03Mes:string;
    ban03Numero:string;
    ban03clientetipoanalisis:string;
ban03clienteruc:string;

ban03Importe:number;
ban03moneda:string;
ban03FechaDeposito:string;
ban03MedioPago:string;
ban03Motivo:string;
ban03VoucherLibroCod:string;
ban03VoucherNumero:string;
}

export interface TraeRegistroCobro
{
    	 ban03empresa : string;
		 ban03anio :string;
		 ban03mes : string;
		 ban03numero:string;
		 clienteCodigo: string;
		 clienteNombre: string;
		 ban03FechaDeposito :string
		 monedaDescripcion : string;
		 ban03Importe:number;
		 medioPagoCodigo:string
		 medioPagoDescripcion:string;
		 ban03Motivo:string;
         Ban03Moneda:string;
         ban03VoucherLibroCod:string;
         ban03VoucherNumero:string;
         
}
export interface RegistroCobroDetalle{
    ban04Empresa :string;
    ban04Numero:string;
    ban04Item:number;
    ban04Tipodoc:string;
    ban04NroDoc:string;
    ban04PagoSoles:string;
    ban04PagoDolares:string;
    ban04Observacion:string;
}

export interface RegistroCobroDocSustento{
    ban05Empresa:string;
    ban05Numero:string;
    ban05Item:number;
    ban05NombreArchivo:string;
    ban05DescripcionArchivo:string;
    ban05contenidoArchivo:string;
}
export interface FacturaPorCobrar{
    fecha:string;
    codigoTipoDocumento:string;
    descripcionDocumento:string;
    
    tipoCambio:number;
    numeroDocumento:string;
    descripcionFactura:string;
    subtotal:number;
    totalSoles:number;
    totalDolares:number;
    clave:string;
    clienteNombre:string;

}
/*
Ban05Empresa	varchar
Ban05Numero	varchar
Ban05Item	int
Ban05NombreArchivo	varchar
Ban05DescripcionArchivo	varchar
Ban05contenidoArchivo	varbinary
*/ 
