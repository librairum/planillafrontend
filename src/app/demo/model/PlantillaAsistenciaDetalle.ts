/* Milton Garriazo */

export interface PlantillaAsistenciaDetalle {
  pla21empresacod: string;      // text NOT NULL
  pla21plantillacod: string;    // text NOT NULL
  pla21correlativo: number;     // integer NOT NULL
  pla21camponombre: string;     // text NOT NULL
  pla21campoalias: string;      // text NOT NULL
  estado?: number;              // integer NULL (Opcional, 0 o 1)
}
