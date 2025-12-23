import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interfaz para los datos de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Interfaz para los datos de login
export interface LoginData {
  email: string;
  password: string;
}

// Interfaz para la respuesta del registro
export interface RegisterResponse {
  status: string;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  token: string;
  token_type: string;
}

// Interfaz para la respuesta del login (misma estructura que RegisterResponse)
export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  token: string;
  token_type: string;
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
 * Función para registrar un nuevo usuario
 * @param data - Datos del usuario a registrar
 * @returns Promise con la respuesta del servidor
 */
export const registerRequest = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al registrar usuario',
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
 * Función para iniciar sesión
 * @param data - Datos de login (email y password)
 * @returns Promise con la respuesta del servidor
 */
export const loginRequest = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Si hay una respuesta del servidor con errores
      const errorData = error.response.data as ErrorResponse;
      throw {
        status: error.response.status,
        message: errorData.message || 'Error al iniciar sesión',
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

// Exportar la instancia de axios para usar en otras partes de la aplicación
export { api };
