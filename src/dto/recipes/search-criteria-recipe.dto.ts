import { ArrayMinSize, Min, MinLength, ValidateNested } from 'class-validator';
export class IngredientSearchDto {
    id: string;
    @Min(1)
    quantity: number;
  }

export class findByCriteriaRecipeDto {
  searchString?: string;
  time?: number;
  difficulty?: number;
  ingredients?: IngredientSearchDto[];
  onlyAvailable?: boolean;
}


