import { ArrayMinSize, Min, MinLength, ValidateNested } from 'class-validator';

export class findByCriteriaRecipeDto {
  searchString?: string;
  time?: number;
  difficulty?: number;
  ingredients?: string[];
  onlyAvailable?: boolean;
}


