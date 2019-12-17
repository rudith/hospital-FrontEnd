export interface PersonalCreate {
  id?: number,
  dni?: number,
  nombres?: string,
  apellido_paterno?: string,
  apellido_materno?: string,
  celular?: number,
  telefono?: number,
  direccion?: string,
  fechaReg?: string,
  updated_at?: string,
  estReg?: boolean,
  area?: number,
  tipo_personal?: number,
  especialidad?: number,
}
