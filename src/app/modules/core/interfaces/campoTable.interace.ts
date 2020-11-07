export interface Campo {
  nombre: string;
  nombreUi: string;
  tipoDato: string;
  tipoCampoId: number;
  requerido: boolean;
  visible: boolean;
  orden: number;
  mascaraId: number;
  minLength: number;
  maxLength: number;
  buscador: boolean;
  verList: boolean;
}
