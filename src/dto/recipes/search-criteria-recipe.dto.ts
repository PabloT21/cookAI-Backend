import { ArrayMinSize, Min, MinLength, ValidateNested } from 'class-validator';
import { PaginationQueryDto } from '../common/pagination.dto';

export class IngredientSearchDto {
    id: string;
    @Min(1)
    quantity: number;
  }

/**
 * DTO para búsqueda de recetas con paginación
 * Extiende PaginationQueryDto para incluir page y limit automáticamente
 */
export class findByCriteriaRecipeDto extends PaginationQueryDto {
  searchString?: string;
  time?: number;
  difficulty?: number;
  ingredients?: IngredientSearchDto[];
  onlyAvailable?: boolean;
  onlyFavorites?: boolean;
}
