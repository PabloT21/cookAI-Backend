import { ArrayMinSize, Min, MinLength, ValidateNested } from 'class-validator';
export class IngredientInputDto {
  id: string;
  name: string;
  @Min(1)
  quantity: number;
  unit: string;
}



export class CreateRecipeDto {
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

