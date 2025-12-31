import { Injectable, Inject, Optional } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponseDto, ApiErrorResponseDto } from '../dto/common/api-response.dto';

// Tipos para respuestas estandarizadas (alias para compatibilidad)
export type ApiResponse<T = any> = ApiResponseDto<T>;
export type ApiErrorResponse = ApiErrorResponseDto;

// Interfaz para la configuración del ResponseHandler
export interface ResponseHandlerConfig {
  entityName?: string;
}

// Token para la inyección de configuración
export const RESPONSE_HANDLER_CONFIG = 'RESPONSE_HANDLER_CONFIG';

@Injectable()
export class ResponseHandlerService {
  private config: ResponseHandlerConfig;

  constructor(
    @Optional()
    @Inject(RESPONSE_HANDLER_CONFIG)
    config?: ResponseHandlerConfig,
  ) {
    this.config = config || {};
  }
  /**
   * Respuesta exitosa genérica
   * @param data - Datos a retornar (puede ser cualquier tipo)
   * @param messageCode - Código del mensaje (opcional, se genera automáticamente si no se proporciona)
   * @param statusCode - Código de estado HTTP (opcional, por defecto 200)
   */
  success<T = any>(
    data: T,
    messageCode?: string,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    const code = messageCode || this.buildGenericMessage('success');
    return {
      success: true,
      data,
      message: code,
      statusCode,
    };
  }

  /**
   * Respuesta de error genérica
   * @param messageCode - Código del mensaje de error
   * @param statusCode - Código de estado HTTP (por defecto 400)
   * @param error - Tipo de error (opcional)
   * @param errors - Errores de validación o detalles adicionales (opcional)
   */
  error(
    messageCode: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
    errors?: any,
  ): ApiErrorResponse {
    return {
      success: false,
      message: messageCode,
      error: error || 'error',
      statusCode,
      ...(errors && { errors }),
    };
  }

  /**
   * Lanza una excepción HTTP estandarizada
   * @param messageCode - Código del mensaje de error
   * @param statusCode - Código de estado HTTP (por defecto 400)
   * @param error - Tipo de error (opcional)
   */
  throwError(
    messageCode: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
  ): never {
    throw new HttpException(
      {
        success: false,
        message: messageCode,
        error: error || 'error',
        statusCode,
      },
      statusCode,
    );
  }

  /**
   * Respuesta de creación exitosa (201)
   * @param data - Datos del recurso creado
   * @param messageCode - Código del mensaje (opcional, se genera automáticamente)
   */
  created<T = any>(
    data: T,
    messageCode?: string,
  ): ApiResponse<T> {
    const code = messageCode || this.buildGenericMessage('created');
    return this.success(data, code, HttpStatus.CREATED);
  }

  /**
   * Respuesta de actualización exitosa (200)
   * @param data - Datos del recurso actualizado
   * @param messageCode - Código del mensaje (opcional, se genera automáticamente)
   */
  updated<T = any>(
    data: T,
    messageCode?: string,
  ): ApiResponse<T> {
    const code = messageCode || this.buildGenericMessage('updated');
    return this.success(data, code, HttpStatus.OK);
  }

  /**
   * Respuesta de eliminación exitosa (200)
   * @param messageCode - Código del mensaje (opcional, se genera automáticamente)
   */
  deleted(messageCode?: string): ApiResponse<null> {
    const code = messageCode || this.buildGenericMessage('deleted');
    return this.success(null, code, HttpStatus.OK);
  }

  /**
   * Respuesta de recurso no encontrado (404)
   * @param resourceCode - Código del recurso (opcional, usa entityName de config si no se proporciona)
   */
  notFound(resourceCode?: string): never {
    const code = resourceCode 
      ? `${resourceCode}_not_found`
      : this.buildGenericMessage('not_found');
    return this.throwError(code, HttpStatus.NOT_FOUND, 'not_found');
  }

  /**
   * Respuesta de error de validación (400)
   * @param errors - Errores de validación
   * @param messageCode - Código del mensaje (opcional, por defecto 'validation_error')
   */
  validationError(errors: any, messageCode: string = 'validation_error'): never {
    throw new HttpException(
      {
        success: false,
        message: messageCode,
        error: 'validation_error',
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * Respuesta de conflicto (409)
   * @param messageCode - Código del mensaje (opcional, por defecto 'resource_already_exists')
   */
  conflict(messageCode: string = 'resource_already_exists'): never {
    return this.throwError(messageCode, HttpStatus.CONFLICT, 'conflict');
  }

  /**
   * Respuesta de no autorizado (401)
   * @param messageCode - Código del mensaje (opcional, por defecto 'unauthorized')
   */
  unauthorized(messageCode: string = 'unauthorized'): never {
    return this.throwError(messageCode, HttpStatus.UNAUTHORIZED, 'unauthorized');
  }

  /**
   * Respuesta de prohibido (403)
   * @param messageCode - Código del mensaje (opcional, por defecto 'forbidden')
   */
  forbidden(messageCode: string = 'forbidden'): never {
    return this.throwError(messageCode, HttpStatus.FORBIDDEN, 'forbidden');
  }


  // Funciones helper para las respuestas
  private buildGenericMessage(event: string): string {
    const entityName = this.config.entityName || 'resource';
    return `${entityName}_${event}`;
  }
}
