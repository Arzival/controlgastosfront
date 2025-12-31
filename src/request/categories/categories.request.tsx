import { api } from '../auth/auth.request';

// ==================== INTERFACES ====================

// Interfaz para los datos de creación de categoría
export interface CreateCategoryData {
  name: string;
  color: string;
}

// Interfaz para la respuesta de creación de categoría
export interface CategoryResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    color: string;
    created_at: string;
  };
}

// Interfaz para la respuesta de obtener todas las categorías
export interface GetCategoriesResponse {
  status: string;
  data: Array<{
    id: number;
    name: string;
    color: string;
    created_at: string;
  }>;
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

// ==================== FUNCIONES DE PETICIÓN ====================

/**
 * Función para obtener todas las categorías del usuario
 * @returns Promise con la respuesta del servidor
 */
export const getCategoriesRequest = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await api.get<GetCategoriesResponse>('/categories');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al obtener categorías',
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
 * Función para crear una nueva categoría
 * @param data - Datos de la categoría a crear
 * @returns Promise con la respuesta del servidor
 */
export const createCategoryRequest = async (
  data: CreateCategoryData
): Promise<CategoryResponse> => {
  try {
    const response = await api.post<CategoryResponse>('/categories', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al crear categoría',
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
