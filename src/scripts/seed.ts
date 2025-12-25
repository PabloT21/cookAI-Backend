import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Ingredient } from '../entities/ingredient.entity';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeTag } from '../entities/recipeTag.entity';
import { User } from '../entities/user.entity';
import * as argon2 from 'argon2';

// Arrays de datos proporcionados
const recetas = [
  {
    name: 'Pechugas de Pollo a la Plancha con Ensalada',
    time: 20,
    difficulty: 1,
    instructions:
      'Sazona las pechugas de pollo. Cocínalas en la sartén con un poco de aceite de oliva hasta que estén doradas. Sirve sobre una cama de lechuga, tomate y cebolla.',
    ingredients: ['pollo', 'aceite de oliva', 'lechuga', 'tomate', 'cebolla'],
    tags: [
      'alta en proteínas',
      'bajo en grasas',
      'fácil',
      'rápida',
      'sartén',
      'almuerzo',
      'cena',
    ],
  },
  {
    name: 'Omelette de Queso y Espinaca',
    time: 10,
    difficulty: 1,
    instructions:
      'Bate los huevos y sazona. Vierte en una sartén con un poco de manteca. Agrega queso y espinaca. Dobla y sirve.',
    ingredients: ['huevos', 'queso', 'espinaca', 'manteca'],
    tags: [
      'alta en proteínas',
      'rápida',
      'fácil',
      'sartén',
      'desayuno',
      'bajo en carbohidratos',
    ],
  },
  {
    name: 'Lentejas Guisadas Clásicas',
    time: 50,
    difficulty: 2,
    instructions:
      'Sofríe cebolla, ajo, morrón y zanahoria. Agrega las lentejas, agua (o caldo) y cocina a fuego lento hasta que estén tiernas.',
    ingredients: ['lentejas', 'cebolla', 'ajo', 'morrón', 'zanahoria', 'aceite de oliva'],
    tags: [
      'alto en fibra',
      'alto en proteínas',
      'económica',
      'olla',
      'almuerzo',
      'cena',
      'vegetariana',
    ],
  },
  {
    name: 'Salteado de Tofu con Brócoli y Arroz',
    time: 30,
    difficulty: 2,
    instructions:
      'Corta y saltea el tofu con el brócoli y ajo en un poco de aceite vegetal. Sirve sobre arroz cocido.',
    ingredients: ['tofu', 'brócoli', 'ajo', 'arroz', 'aceite vegetal'],
    tags: ['vegana', 'alta en proteínas', 'sartén', 'almuerzo', 'cena', 'alto en carbohidratos'],
  },
  {
    name: 'Puré de Papas Cremoso',
    time: 35,
    difficulty: 1,
    instructions:
      'Hierve y pisa las papas. Mezcla con leche, manteca y un poco de crema. Sazona.',
    ingredients: ['papas', 'leche', 'manteca', 'crema'],
    tags: ['fácil', 'alto en carbohidratos', 'olla', 'guarnición'],
  },
  {
    name: 'Fideos con Tomate y Albahaca',
    time: 25,
    difficulty: 1,
    instructions:
      'Cocina los fideos según las instrucciones. Calienta una salsa simple de tomate, ajo y aceite de oliva. Mezcla los fideos con la salsa.',
    ingredients: ['fideos', 'tomate', 'ajo', 'aceite de oliva'],
    tags: ['vegetariana', 'rápida', 'fácil', 'olla', 'almuerzo', 'cena'],
  },
  {
    name: 'Bowl de Yogur con Avena y Frutos Secos',
    time: 5,
    difficulty: 1,
    instructions:
      'En un bowl, combina yogur con avena. Decora con frutos secos y rebanadas de banana.',
    ingredients: ['yogur', 'avena', 'frutos secos', 'banana'],
    tags: ['alta en proteínas', 'alto en fibra', 'rápida', 'fácil', 'desayuno', 'snack'],
  },
  {
    name: 'Pescado al Horno con Limón y Batatas',
    time: 40,
    difficulty: 2,
    instructions:
      'Coloca el pescado y las batatas cortadas en una fuente para horno. Rocía con aceite de oliva y jugo de limón. Hornea hasta que estén cocidos.',
    ingredients: ['pescado', 'batatas', 'limón', 'aceite de oliva'],
    tags: ['alto en grasas saludables', 'sin tacc', 'horno', 'cena'],
  },
  {
    name: 'Tacos de Carne Vacuna con Tortillas',
    time: 35,
    difficulty: 2,
    instructions:
      'Cocina la carne vacuna picada en una sartén con cebolla y morrón. Calienta las tortillas y rellena con la carne y un poco de lechuga.',
    ingredients: ['carne vacuna', 'tortillas', 'cebolla', 'morrón', 'lechuga'],
    tags: ['alta en proteínas', 'sartén', 'cena', 'rápida'],
  },
  {
    name: 'Wrap Vegano de Hummus y Verduras',
    time: 15,
    difficulty: 1,
    instructions:
      'Unta las tortillas con un hummus casero (de garbanzos, limón, aceite de oliva). Rellena con zanahoria rallada, tomate y lechuga.',
    ingredients: [
      'tortillas',
      'garbanzos',
      'limón',
      'aceite de oliva',
      'zanahoria',
      'tomate',
      'lechuga',
    ],
    tags: ['vegana', 'alto en fibra', 'rápida', 'fácil', 'almuerzo', 'snack'],
  },
  {
    name: 'Berenjenas Rellenas de Quinoa',
    time: 60,
    difficulty: 3,
    instructions:
      'Parte las berenjenas y hornea hasta ablandar. Mezcla la pulpa con quinoa cocida, cebolla y ajo. Rellena las berenjenas y hornea de nuevo con queso por encima.',
    ingredients: ['berenjena', 'quinoa', 'cebolla', 'ajo', 'queso', 'aceite de oliva'],
    tags: ['vegetariana', 'alto en fibra', 'horno', 'cena'],
  },
  {
    name: 'Porotos Negros con Arroz',
    time: 45,
    difficulty: 2,
    instructions:
      'Cocina los porotos y el arroz por separado. Sofríe cebolla, ajo y morrón. Mezcla todo en una olla y cocina unos minutos más.',
    ingredients: ['porotos', 'arroz', 'cebolla', 'ajo', 'morrón'],
    tags: ['vegana', 'alto en proteínas', 'alto en fibra', 'económica', 'olla', 'almuerzo'],
  },
  {
    name: 'Panqueques de Avena y Banana',
    time: 15,
    difficulty: 2,
    instructions:
      'Licúa avena, banana, huevos y un poco de leche. Cocina pequeñas porciones en una sartén hasta que estén doradas. Sirve con frutilla.',
    ingredients: ['avena', 'banana', 'huevos', 'leche', 'frutilla'],
    tags: ['desayuno', 'rápida', 'sartén', 'alto en fibra'],
  },
  {
    name: 'Polenta Cremosa con Queso',
    time: 20,
    difficulty: 1,
    instructions:
      'Hierve agua o leche. Agrega la polenta lentamente mientras revuelves. Cocina hasta espesar. Retira del fuego y añade queso y manteca.',
    ingredients: ['polenta', 'leche', 'queso', 'manteca'],
    tags: ['vegetariana', 'rápida', 'fácil', 'olla', 'guarnición'],
  },
  {
    name: 'Brochetas de Cerdo y Zapallo a la Parrilla',
    time: 45,
    difficulty: 3,
    instructions:
      'Corta la carne de cerdo y el zapallo en cubos. Arma las brochetas y pincela con aceite de oliva. Cocina a la parrilla hasta que estén hechos.',
    ingredients: ['carne de cerdo', 'zapallo', 'aceite de oliva'],
    tags: ['alta en proteínas', 'parrilla', 'cena', 'sin tacc'],
  },
  {
    name: 'Ensalada de Quinoa con Garbanzos y Morrones',
    time: 30,
    difficulty: 2,
    instructions:
      'Mezcla quinoa cocida con garbanzos. Agrega morrones, cebolla picada y perejil. Adereza con aceite de oliva y limón.',
    ingredients: ['quinoa', 'garbanzos', 'morrón', 'cebolla', 'aceite de oliva', 'limón'],
    tags: ['vegana', 'alto en fibra', 'para meal prep', 'almuerzo', 'sin tacc'],
  },
  {
    name: 'Revuelto de Acelga y Ajo',
    time: 15,
    difficulty: 1,
    instructions:
      'Sofríe ajo en aceite de oliva. Agrega la acelga picada y cocina hasta que se ablande. Agrega dos huevos batidos y revuelve hasta que cuajen.',
    ingredients: ['acelga', 'ajo', 'huevos', 'aceite de oliva'],
    tags: ['vegetariana', 'rápida', 'fácil', 'sartén', 'guarnición', 'bajo en carbohidratos'],
  },
  {
    name: 'Sopa de Zucchini y Queso',
    time: 35,
    difficulty: 2,
    instructions:
      'Hierve zucchini, cebolla y un poco de ajo en agua o caldo. Licúa y vuelve a la olla. Agrega un poco de queso y crema para darle cremosidad.',
    ingredients: ['zucchini', 'cebolla', 'ajo', 'queso', 'crema'],
    tags: ['vegetariana', 'bajo en carbohidratos', 'olla', 'cena', 'sin tacc'],
  },
  {
    name: 'Budín de Pan y Frutos Secos',
    time: 70,
    difficulty: 3,
    instructions:
      'Remoja trozos de pan en leche, huevos y azúcar (no añadido, usar solo si el pan ya contiene algo de azúcar, sino solo leche y huevos). Agrega frutos secos. Vierte en un molde y hornea a baño maría.',
    ingredients: ['pan', 'leche', 'huevos', 'frutos secos'],
    tags: ['postre', 'horno', 'económica'],
  },
  {
    name: 'Camarones al Ajillo (Mariscos)',
    time: 15,
    difficulty: 1,
    instructions:
      'Saltea los mariscos (camarones) con abundante ajo en aceite de oliva en una sartén caliente. Sirve inmediatamente.',
    ingredients: ['mariscos', 'ajo', 'aceite de oliva'],
    tags: ['alta en proteínas', 'rápida', 'fácil', 'sartén', 'cena', 'keto'],
  },
];

const ingredients = [
  'pollo',
  'carne vacuna',
  'carne de cerdo',
  'pescado',
  'mariscos',
  'huevos',
  'tofu',
  'seitán',
  'tempeh',
  'leche',
  'yogur',
  'queso',
  'manteca',
  'crema',
  'arroz',
  'fideos',
  'quinoa',
  'couscous',
  'polenta',
  'harina de trigo',
  'harina integral',
  'pan',
  'tortillas',
  'papas',
  'batatas',
  'zanahoria',
  'cebolla',
  'ajo',
  'morrón',
  'tomate',
  'espinaca',
  'acelga',
  'lechuga',
  'brócoli',
  'coliflor',
  'zapallo',
  'zucchini',
  'berenjena',
  'legumbres',
  'lentejas',
  'garbanzos',
  'porotos',
  'avena',
  'frutos secos',
  'manzana',
  'banana',
  'frutilla',
  'arándanos',
  'durazno',
  'naranja',
  'limón',
  'aceite de oliva',
  'aceite vegetal',
];

const tags = [
  'alta en proteínas',
  'baja en calorías',
  'baja en carbohidratos',
  'alto en carbohidratos',
  'alto en fibra',
  'bajo en grasas',
  'alto en grasas saludables',
  'vegetariana',
  'vegana',
  'sin tacc',
  'sin lactosa',
  'sin azúcares añadidos',
  'keto',
  'paleo',
  'diabético-friendly',
  'rápida',
  'fácil',
  'económica',
  'para meal prep',
  'para microondas',
  'horno',
  'sartén',
  'olla',
  'airfryer',
  'parrilla',
  'desayuno',
  'almuerzo',
  'cena',
  'snack',
  'postre',
];

// Funciones auxiliares
function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(normalizeKey))].filter(Boolean);
}

async function upsertByName<T extends { name: string }>(
  repo: Repository<T>,
  name: string,
): Promise<T> {
  const existing = await repo.findOne({ where: { name } as any });
  if (existing) return existing;
  const entity = { name } as T;
  return repo.save(entity);
}

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const dataSource = app.get(DataSource);
    const ingredientRepo = dataSource.getRepository(Ingredient);
    const recipeRepo = dataSource.getRepository(Recipe);
    const recipeIngredientRepo = dataSource.getRepository(RecipeIngredient);
    const recipeTagRepo = dataSource.getRepository(RecipeTag);
    const userRepo = dataSource.getRepository(User);

    console.log('[seed] Iniciando seed...');

    // 1) Crear ingredientes (idempotente)
    console.log('[seed] Creando ingredientes...');
    const ingredientMap = new Map<string, Ingredient>();
    for (const name of ingredients) {
      const existing = await ingredientRepo.findOne({ where: { name } });
      if (existing) {
        ingredientMap.set(name.toLowerCase(), existing);
        continue;
      }
      const keys = uniqueStrings([name]);
      const ingredient = ingredientRepo.create({
        name,
        keys,
      });
      const saved = await ingredientRepo.save(ingredient);
      ingredientMap.set(name.toLowerCase(), saved);
    }
    console.log(`[seed] ✓ ${ingredientMap.size} ingredientes listos`);

    // 2) Crear tags de recetas (idempotente)
    console.log('[seed] Creando tags de recetas...');
    const tagMap = new Map<string, RecipeTag>();
    for (const tagName of tags) {
      const tag = await upsertByName(recipeTagRepo, tagName);
      tagMap.set(tagName.toLowerCase(), tag);
    }
    console.log(`[seed] ✓ ${tagMap.size} tags listos`);

    // 3) Crear usuario seed (si no existe)
    console.log('[seed] Creando usuario seed...');
    let seedUser = await userRepo.findOne({
      where: { email: 'seed@cookai.com' },
    });
    if (!seedUser) {
      seedUser = userRepo.create({
        name: 'Seed User',
        email: 'seed@cookai.com',
        password: await argon2.hash('seed_password'), // Contraseña por defecto para seed
      });
      seedUser = await userRepo.save(seedUser);
    }
    console.log('[seed] ✓ Usuario seed listo');

    // 4) Crear recetas
    console.log('[seed] Creando recetas...');
    let created = 0;
    let updated = 0;

    for (const recetaData of recetas) {
      const existing = await recipeRepo.findOne({
        where: { name: recetaData.name },
      });

      // Generar keys desde el nombre y los ingredientes
      const keys = uniqueStrings([
        recetaData.name.toLowerCase(),
        ...recetaData.ingredients.map((i) => i.toLowerCase()),
      ]);

      // Mapear ingredientes por nombre (strings) a entidades
      const recipeIngredients: RecipeIngredient[] = [];
      for (const ingName of recetaData.ingredients) {
        const ing = ingredientMap.get(ingName.toLowerCase());
        if (!ing) {
          console.warn(
            `[seed] ⚠ Ingrediente "${ingName}" no encontrado para receta "${recetaData.name}", se omite`,
          );
          continue;
        }
        recipeIngredients.push(
          recipeIngredientRepo.create({
            ingredient: ing,
            quantity: 1, // Valor por defecto, ya que no viene en los datos
            unit: 'u', // Valor por defecto
          }),
        );
      }

      // Mapear tags por nombre (strings) a entidades
      const recipeTags: RecipeTag[] = [];
      for (const tagName of recetaData.tags) {
        const tag = tagMap.get(tagName.toLowerCase());
        if (tag) {
          recipeTags.push(tag);
        }
      }

      let recipe: Recipe;
      if (existing) {
        // Actualizar receta existente
        recipe = existing;
        recipe.name = recetaData.name;
        recipe.instructions = recetaData.instructions;
        recipe.keys = keys;
        recipe.time = recetaData.time;
        recipe.difficulty = recetaData.difficulty;
        recipe.user = seedUser;
        recipe.ingredients = recipeIngredients;
        recipe.tags = recipeTags;
        updated++;
      } else {
        // Crear nueva receta
        recipe = recipeRepo.create({
          name: recetaData.name,
          instructions: recetaData.instructions,
          keys,
          time: recetaData.time,
          difficulty: recetaData.difficulty,
          user: seedUser,
          ingredients: recipeIngredients,
          tags: recipeTags,
        });
        created++;
      }

      await recipeRepo.save(recipe);
    }

    console.log(`[seed] ✓ ${created} recetas creadas, ${updated} actualizadas`);

    // Resumen final
    const [ingCount, tagCount, recCount] = await Promise.all([
      ingredientRepo.count(),
      recipeTagRepo.count(),
      recipeRepo.count(),
    ]);
    console.log(
      `[seed] ✅ Completado - ingredientes=${ingCount}, tags=${tagCount}, recetas=${recCount}`,
    );
  } catch (err) {
    console.error('[seed] ❌ ERROR:', err);
    throw err;
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error('[seed] ERROR FATAL:', err);
  process.exit(1);
});
