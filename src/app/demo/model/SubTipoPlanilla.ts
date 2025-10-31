/* Milton Garriazo */
export interface SubTipoPlanilla {
  pla55empresacod: string;
  pla55planillatipocod: string;
  pla55codigo: string;
  pla55descripcion: string;
  pla55conceptoxdefault: string;
  pla55flagactivo: number; //El metodo cambia a number 1/0
  pla55plantillaasistenciacod: string;
  pla55flagregulaaporteminessalud: string;

  planillaTipoDes?: string;           // PlanillaTipoDes
  conceptoxdefaultDes?: string;       // ConceptoxdefaultDes
  plantillaAsistenciaDes?: string;    // PlantillaAsistenciaDes
}

/*Pla55EmpresaCod TEXT,
 Pla55PlanillaTipoCod TEXT,
  PlanillaTipoDes TEXT,
   Pla55Codigo TEXT,
    Pla55Descripcion TEXT,
     Pla55Conceptoxdefault TEXT,
      ConceptoxdefaultDes TEXT,
       Pla55FlagActivo INTEGER,
        Pla55PlantillaAsistenciaCod TEXT,
         PlantillaAsistenciaDes TEXT
*/
