import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 정적 자산 서빙: Room DB 파일을 외부에 노출하듯, build 결과물을 고정 경로로 노출
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api*'], // API 트래픽은 ViewModel 경로로만 흐르게 차단
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
