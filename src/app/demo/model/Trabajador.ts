/* Milton Garriazo */

export interface Trabajador {
  pla01empresacod: string; //pk
  pla01empleadocod: string; //pk
  pla01planillacod: string;
  pla01docuidentidadtipo: string;
  pla01docuidentidadnro: string;

  pla01apepaterno: string;
  pla01apematerno: string;
  pla01nombre1: string;
  pla01nombre2: string;
  pla01direccion: string;
  pla01fechanacimiento: Date; //fecha
  pla01telefono: string;
  pla01fechaingreso: Date; //fecha
  pla01centrocostocod: string;

  //ocultos

  pla01fechacese: Date; //fecha
  pla01sexo: string;
  pla01estado: string;

  pla01puestocod: string;
  pla01ctaremunbancocod: string;
  pla01ctaremunumero: string;
  pla01ctaremunmoneda: string;

  pla01trdatoslabregimenlaboral?: string;
  labregimenlaboraldes?: string;

  //detalles adicionales

}

/*

CreateGridColumn(Grid, "Pla01EmpresaCod", "Pla01EmpresaCod", 0, "", 70, true, false, false);

            CreateGridColumn(Grid, "Pla01PlanillaCod", "Pla01PlanillaCod", 0, "", 70, true, false, false);
            CreateGridColumn(Grid, "Pla01DocuIdentidadTipo", "Pla01DocuIdentidadTipo", 0, "", 70, true, false, false);

            CreateGridColumn(Grid, "Codigo", "Pla01EmpleadoCod", 0, "", 70, true, false, itIsVisible);
            CreateGridColumn(Grid, "Doc.Identidad", "Pla01DocuIdentidadNro", 0, "", 120, true, false, itIsVisible);
            CreateGridColumn(Grid, "Apellidos y Nombres", "ApellidosyNombres", 0, "", 250, true, false, itIsVisible);
            CreateGridColumn(Grid, "Direccion", "Pla01Direccion", 0, "", 150, true, false, itIsVisible);
            CreateGridColumn(Grid, "Fec.Nac.", "Pla01FechaNacimiento", 0, "{0:dd/MM/yyyy}", 90, true, false, itIsVisible);
            CreateGridColumn(Grid, "Telefono", "Pla01Telefono", 0, "", 120, true, false, itIsVisible);
            CreateGridColumn(Grid, "Fec.Ingreso", "Pla01FechaIngreso", 0, "{0:dd/MM/yyyy}", 100, true, false, itIsVisible);
            CreateGridColumn(Grid, "Centro costo", "Pla01CentroCostoCod", 0, "", 120, true, false, itIsVisible);

            //oculto
            CreateGridColumn(Grid, "Pla01FechaCese", "Pla01FechaCese", 0, "", 90, true, false, false);
            CreateGridColumn(Grid, "Pla01Sexo", "Pla01Sexo", 0, "", 70, true, false, false);
            CreateGridColumn(Grid, "Pla01Estado", "Pla01Estado", 0, "", 70, true, false, false);

            //oculto
            CreateGridColumn(Grid, "Pla01PuestoCod", "Pla01PuestoCod", 0, "", 90, true, false, false);
            CreateGridColumn(Grid, "Pla01CtaRemuBancoCod", "Pla01CtaRemuBancoCod",0,"",90, true, false, false);
            CreateGridColumn(Grid, "Pla01CtaRemuNumero" , "Pla01CtaRemuNumero", 0,"",90, true, false, false);
            CreateGridColumn(Grid, "Pla01CtaRemuMoneda", "Pla01CtaRemuMoneda", 0, "", 90, true, false, false);
            */
