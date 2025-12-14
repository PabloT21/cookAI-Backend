import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// Tipos para respuestas estandarizadas
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  errors?: any; // Para errores de validación
}

@Injectable()
export class ResponseHandlerService {
  /**
   * Respuesta exitosa genérica
   * @param data - Datos a retornar (puede ser cualquier tipo)
   * @param message - Mensaje descriptivo (opcional)
   * @param statusCode - Código de estado HTTP (opcional, por defecto 200)
   */
  success<T = any>(
    data: T,
    message?: string,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message ?? 'Operación exitosa',
      statusCode,
    };
  }

  /**
   * Respuesta de error genérica
   * @param message - Mensaje de error
   * @param statusCode - Código de estado HTTP (por defecto 400)
   * @param error - Tipo de error (opcional)
   * @param errors - Errores de validación o detalles adicionales (opcional)
   */
  error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
    errors?: any,
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      error: error || 'Error',
      statusCode,
      ...(errors && { errors }),
    };
  }

  /**
   * Lanza una excepción HTTP estandarizada
   * @param message - Mensaje de error
   * @param statusCode - Código de estado HTTP (por defecto 400)
   * @param error - Tipo de error (opcional)
   */
  throwError(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
  ): never {
    throw new HttpException(
      {
        success: false,
        message,
        error: error || 'Error',
        statusCode,
      },
      statusCode,
    );
  }

  /**
   * Respuesta de creación exitosa (201)
   * @param data - Datos del recurso creado
   * @param message - Mensaje descriptivo (opcional)
   */
  created<T = any>(
    data: T,
    message?: string,
  ): ApiResponse<T> {
    return this.success(data, message, HttpStatus.CREATED);
  }

  /**
   * Respuesta de actualización exitosa (200)
   * @param data - Datos del recurso actualizado
   * @param message - Mensaje descriptivo (opcional)
   */
  updated<T = any>(
    data: T,
    message?: string,
  ): ApiResponse<T> {
    return this.success(data, message, HttpStatus.OK);
  }

  /**
   * Respuesta de eliminación exitosa (200)
   * @param message - Mensaje descriptivo (opcional)
   */
  deleted(message?: string): ApiResponse<null> {
    return this.success(null, message, HttpStatus.OK);
  }

  /**
   * Respuesta de recurso no encontrado (404)
   * @param resource - Nombre del recurso (opcional)
   */
  notFound(resource: string = 'Recurso'): never {
    return this.throwError(
      `${resource} no encontrado`,
      HttpStatus.NOT_FOUND,
      'Not Found',
    );
  }

  /**
   * Respuesta de error de validación (400)
   * @param errors - Errores de validación
   * @param message - Mensaje descriptivo (opcional)
   */
  validationError(errors: any, message: string = 'Error de validación'): never {
    throw new HttpException(
      {
        success: false,
        message,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * Respuesta de conflicto (409)
   * @param message - Mensaje descriptivo
   */
  conflict(message: string = 'El recurso ya existe'): never {
    return this.throwError(message, HttpStatus.CONFLICT, 'Conflict');
  }

  /**
   * Respuesta de no autorizado (401)
   * @param message - Mensaje descriptivo (opcional)
   */
  unauthorized(message: string = 'No autorizado'): never {
    return this.throwError(message, HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  /**
   * Respuesta de prohibido (403)
   * @param message - Mensaje descriptivo (opcional)
   */
  forbidden(message: string = 'Acceso prohibido'): never {
    return this.throwError(message, HttpStatus.FORBIDDEN, 'Forbidden');
  }
}
