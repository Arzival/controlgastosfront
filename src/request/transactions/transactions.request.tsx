import { api } from '../auth/auth.request';

// ==================== TRANSACCIONES NORMALES (INGRESOS/EGRESOS) ====================

// Interfaz para los datos de creación de transacción
export interface CreateTransactionData {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description?: string;
  date: string;
  savings_fund_id?: number | string; // Opcional: solo si el gasto es para ahorro
}

// Interfaz para la respuesta de creación de transacción
export interface TransactionResponse {
  status: string;
  message: string;
  data: {
    id: number;
    type: string;
    amount: number;
    category: string;
    description: string | null;
    date: string;
    savings_fund_id: number | null;
    created_at: string;
  };
}

// ==================== TRANSACCIONES DE AHORRO ====================

// Interfaz para los datos de creación de transacción de ahorro
export interface CreateSavingsTransactionData {
  savings_fund_id: number | string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
  date: string;
}

// Interfaz para la respuesta de creación de transacción de ahorro
export interface SavingsTransactionResponse {
  status: string;
  message: string;
  data: {
    id: number;
    savings_fund_id: number;
    type: string;
    amount: number;
    description: string | null;
    date: string;
    created_at: string;
    fund_balance: number; // Balance actualizado del fondo
  };
}

// ==================== INTERFACES DE ERROR ====================

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

// ==================== INTERFACES PARA OBTENER DATOS ====================

// Interfaz para la respuesta de obtener todas las transacciones
export interface GetTransactionsResponse {
  status: string;
  data: Array<{
    id: number;
    type: string;
    amount: number;
    category: string;
    description: string | null;
    date: string;
    savings_fund_id: number | null;
    created_at: string;
  }>;
}

// Interfaz para la respuesta de obtener todas las transacciones de ahorro
export interface GetSavingsTransactionsResponse {
  status: string;
  data: Array<{
    id: number;
    savings_fund_id: number;
    fund_name: string | null;
    fund_color: string | null;
    type: string;
    amount: number;
    description: string | null;
    date: string;
    created_at: string;
  }>;
}

// ==================== FUNCIONES DE PETICIÓN ====================

/**
 * Función para obtener todas las transacciones del usuario
 * @returns Promise con la respuesta del servidor
 */
export const getTransactionsRequest = async (): Promise<GetTransactionsResponse> => {
  try {
    const response = await api.get<GetTransactionsResponse>('/transactions');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al obtener transacciones',
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

/**
 * Función para obtener todas las transacciones de ahorro del usuario
 * @returns Promise con la respuesta del servidor
 */
export const getSavingsTransactionsRequest = async (): Promise<GetSavingsTransactionsResponse> => {
  try {
    const response = await api.get<GetSavingsTransactionsResponse>('/savings-transactions');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al obtener transacciones de ahorro',
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

/**
 * Función para crear una nueva transacción (ingreso/egreso)
 * @param data - Datos de la transacción a crear
 * @returns Promise con la respuesta del servidor
 */
export const createTransactionRequest = async (
  data: CreateTransactionData
): Promise<TransactionResponse> => {
  try {
    const response = await api.post<TransactionResponse>('/transactions', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al crear transacción',
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
 * Función para crear una nueva transacción de ahorro (depósito/retiro)
 * @param data - Datos de la transacción de ahorro a crear
 * @returns Promise con la respuesta del servidor
 */
export const createSavingsTransactionRequest = async (
  data: CreateSavingsTransactionData
): Promise<SavingsTransactionResponse> => {
  try {
    const response = await api.post<SavingsTransactionResponse>('/savings-transactions', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al crear transacción de ahorro',
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
 * Función para eliminar una transacción
 * @param id - ID de la transacción a eliminar
 * @returns Promise con la respuesta del servidor
 */
export const deleteTransactionRequest = async (id: number | string): Promise<DeleteResponse> => {
  try {
    const response = await api.post<DeleteResponse>('/transactions/delete', { id });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al eliminar transacción',
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

/**
 * Función para eliminar una transacción de ahorro
 * @param id - ID de la transacción de ahorro a eliminar
 * @returns Promise con la respuesta del servidor
 */
export const deleteSavingsTransactionRequest = async (id: number | string): Promise<DeleteResponse> => {
  try {
    const response = await api.post<DeleteResponse>('/savings-transactions/delete', { id });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al eliminar transacción de ahorro',
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

// Interfaz para los datos de actualización de transacción
export interface UpdateTransactionData {
  id: number | string;
  type?: 'expense' | 'income';
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  savings_fund_id?: number | string | null;
}

// Interfaz para la respuesta de actualización de transacción
export interface UpdateTransactionResponse {
  status: string;
  message: string;
  data: {
    id: number;
    type: string;
    amount: number;
    category: string;
    description: string | null;
    date: string;
    savings_fund_id: number | null;
    updated_at: string;
  };
}

/**
 * Función para actualizar una transacción
 * @param data - Datos de la transacción a actualizar
 * @returns Promise con la respuesta del servidor
 */
export const updateTransactionRequest = async (
  data: UpdateTransactionData
): Promise<UpdateTransactionResponse> => {
  try {
    const response = await api.post<UpdateTransactionResponse>('/transactions/update', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al actualizar transacción',
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
