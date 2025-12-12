import { ArrayMinSize, Min, MinLength, ValidateNested } from 'class-validator';
export class IngredientInputDto {
  // Si viene, TypeORM actualiza el RecipeIngredient; si no, crea uno nuevo
  recipeIngredientId?: number;
  id: string;
  name: string;
  @Min(1)
  quantity: number;
  unit: string;
}



export class UpdateRecipeDto {
  @MinLength(1)
  name: string;
  instructions: string;
  time?: number;
  difficulty?: number;
  @ValidateNested({ each: true })
  @ArrayMinSize(1) 
  ingredients: IngredientInputDto[];
  
  //dejo las keys para mas adelante
  //keys: string[];}

  //tags lo dejo para cuando se haga la implementacion de los tags
  //tags: string[];

  //el user no lo pongo pq va a venir de la sesion el dia q haya
  
}

