export type Assume<Source, Cast> = Source extends Cast ? Source : never;
