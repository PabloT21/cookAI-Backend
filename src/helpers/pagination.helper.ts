import { PaginationQueryDto } from '../dto/common/pagination.dto';

/**
 * Calcula los valores de skip y take para TypeORM basado en page y limit
 * @param page - Número de página (empieza en 1)
 * @param limit - Cantidad de registros por página
 * @returns Objeto con skip y take para usar en TypeORM
 */
export function getPaginationParams(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
}

/**
 * Extrae los parámetros de paginación de un DTO que extiende PaginationQueryDto
 * @param query - DTO con parámetros de paginación
 * @returns Objeto con skip y take para usar en TypeORM
 */
export function extractPaginationParams(query: PaginationQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  return getPaginationParams(page, limit);
}

/**
 * Interfaz para el resultado de findAndCount de TypeORM
 */
export interface PaginationResult<T> {
  data: T[];
  total: number;
}
