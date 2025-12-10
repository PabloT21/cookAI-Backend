import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientModule } from './modules/ingredient.module';
import { IngredientCategoryModule } from './modules/ingredient-category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'cookai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo, en producción usar migraciones
    }),
    IngredientModule,
    IngredientCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
