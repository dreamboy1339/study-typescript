import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 파이프: DTO를 ViewModel처럼 정제/검증한다는 느낌으로 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 세팅: Apidog 연동을 위해 예시 포함
  const config = new DocumentBuilder()
    .setTitle('Study TypeScript API')
    .setDescription('Frontend 정적 자산을 서빙하고 간단한 API를 제공하는 Nest 서버')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // SPA fallback: OkHttp Interceptor로 모든 비-API 경로를 index.html로 흘려보내는 느낌
  const server = app.getHttpAdapter().getInstance();
  server.use((req: { path?: string; method?: string }, res: { sendFile: (p: string) => void }, next: () => void) => {
    // API는 ViewModel 경로로 패스
    if (req.path && req.path.startsWith('/api')) {
      return next();
    }
    // 정적 자산(.js, .css 등)은 그대로 static 미들웨어로 흘려보냄
    if (req.path && req.path.includes('.')) {
      return next();
    }
    // GET 외 메서드는 서버 라우팅으로 패스
    if (req.method && req.method !== 'GET') {
      return next();
    }
    // 그 외는 SPA index로 포워딩(안드로이드에서 Fragment 전환처럼 클라이언트 라우터에 위임)
    return res.sendFile(join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
  });

  const port = Number(process.env.PORT ?? 8080);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  // 안드로이드 15년차 개발자 비유: Activity onCreate 시점에 포트 바인딩 끝내는 느낌
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
