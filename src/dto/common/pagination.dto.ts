import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * DTO para los query parameters de paginación
 * Se puede extender en otros DTOs usando `extends PaginationQueryDto`
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Límite máximo para evitar cargas excesivas
  limit?: number = 10;
}

/**
 * Metadatos de paginación para la respuesta
 */
export class PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }
}

/**
 * Respuesta paginada genérica
 */
export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}
