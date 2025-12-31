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

// Interfaz para la respuesta de obtener todas las cajas de ahorro
export interface GetSavingsFundsResponse {
  status: string;
  data: Array<{
    id: number;
    name: string;
    description: string | null;
    color: string;
    balance: number;
    created_at: string;
  }>;
}

/**
 * Función para obtener todas las cajas de ahorro del usuario
 * @returns Promise con la respuesta del servidor
 */
export const getSavingsFundsRequest = async (): Promise<GetSavingsFundsResponse> => {
  try {
    const response = await api.get<GetSavingsFundsResponse>('/savings-funds');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al obtener cajas de ahorro',
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

// ==================== FUNCIONES DELETE ====================

// Interfaz para respuesta de eliminación
export interface DeleteResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Función para eliminar una caja de ahorro
 * @param id - ID de la caja de ahorro a eliminar
 * @returns Promise con la respuesta del servidor
 */
export const deleteSavingsFundRequest = async (id: number | string): Promise<DeleteResponse> => {
  try {
    const response = await api.post<DeleteResponse>('/savings-funds/delete', { id });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al eliminar caja de ahorro',
        errors: errorData.errors,
      };
    }
    throw {
      status: 500,
      message: 'Error de conexión. Por favor, intenta de nuevo.',
      errors: undefined,
    };
  }
};

// ==================== FUNCIONES UPDATE ====================

// Interfaz para los datos de actualización de caja de ahorro
export interface UpdateSavingsFundData {
  id: number | string;
  name?: string;
  description?: string;
  color?: string;
}

// Interfaz para la respuesta de actualización de caja de ahorro
export interface UpdateSavingsFundResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string | null;
    color: string;
    balance: number;
    updated_at: string;
  };
}

/**
 * Función para actualizar una caja de ahorro
 * @param data - Datos de la caja de ahorro a actualizar
 * @returns Promise con la respuesta del servidor
 */
export const updateSavingsFundRequest = async (
  data: UpdateSavingsFundData
): Promise<UpdateSavingsFundResponse> => {
  try {
    const response = await api.post<UpdateSavingsFundResponse>('/savings-funds/update', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al actualizar caja de ahorro',
        errors: errorData.errors,
      };
    }
    throw {
      status: 500,
      message: 'Error de conexión. Por favor, intenta de nuevo.',
      errors: undefined,
    };
  }
};
