import { api } from '../auth/auth.request';

// Interfaz para los datos de creación de caja de ahorro
export interface CreateSavingsFundData {
  name: string;
  description?: string;
  color: string;
}

// Interfaz para la respuesta de creación de caja de ahorro
export interface SavingsFundResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string | null;
    color: string;
    balance: number;
    created_at: string;
  };
}

// Interfaz para errores de validación
export interface ValidationErrors {
  [key: string]: string[];
}

// Interfaz para respuesta de error
export interface ErrorResponse {
  status: string;
  message: string;
  errors?: ValidationErrors;
}

/**
 * Función para crear una nueva caja de ahorro
 * @param data - Datos de la caja de ahorro a crear
 * @returns Promise con la respuesta del servidor
 */
export const createSavingsFundRequest = async (
  data: CreateSavingsFundData
): Promise<SavingsFundResponse> => {
  try {
    const response = await api.post<SavingsFundResponse>('/savings-funds', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al crear caja de ahorro',
        errors: errorData.errors,
      };
    }
    // Error de red u otro error
    throw {
      status: 500,
      message: 'Error de conexión. Por favor, intenta de nuevo.',
      errors: undefined,
    };
  }
};
