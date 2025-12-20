import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitimos cors global, desp lo ajustamos
  app.enableCors(); 

  // Agregado el 0.0.0.0 para que el emulador de android lo pueda encontrar
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');

  // Agregado log
  console.log(`Aplicacion corriendo en: ${await app.getUrl()}`);
}
bootstrap();
