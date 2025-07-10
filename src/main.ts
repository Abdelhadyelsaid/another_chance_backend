import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './model/app/app.module';

const developement: number = 0;
let port: number;
let host: string;

if (developement == 0) {
  port = parseInt(process.env.PORT) ?? 3026
  host = "0.0.0.0"
} else {
  port = 3026
  host = "localhost"
}

const successMessage: string = `API Started Listening On ${host}:${port} ....`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });
  await app.listen(port, host).then(() => {
    console.log(successMessage);
  }).catch((error: any) => {
    console.log(error.message);
  });
}

bootstrap();
