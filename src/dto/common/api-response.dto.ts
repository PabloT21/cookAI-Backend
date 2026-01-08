export class ApiResponseDto<T = any> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

export class ApiErrorResponseDto {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  errors?: any; // Para errores de validación
}


