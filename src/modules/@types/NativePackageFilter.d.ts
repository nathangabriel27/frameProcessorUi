
export type DataType = 'base64' | 'path';
export type FilterTypes = 'blackAndWhite' | 'shadesGray';
export type StatusReturn = {
    status: 'success' | 'mensage';
    mensage: string; // Se === success retornar ''
}

export type FilterProps = {
  data: string; // Arquivo base64
  filter: FilterTypes;
}

export interface FilterPropsResponse {
  uri: string | null; // Arquivo base64
  filter: FilterTypes; // Filtro selecionado
  type: 'base64'; // Fixo
  stratus: StatusReturn;
}