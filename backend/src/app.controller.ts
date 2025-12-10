import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    description: '서버 상태 문자열. 안드로이드에서 ViewModel이 상태 스트링을 내려준다고 보면 됩니다.',
  })
  status!: string;
}

@ApiTags('health')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({
    summary: '헬스체크 엔드포인트',
    description:
      'Activity 진입 전에 ViewModel이 준비됐는지 확인하는 헬스체크와 유사합니다. 서버 가동 상태를 문자열로 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 상태 OK',
    type: HealthResponseDto,
    schema: {
      example: { status: 'ok' },
    },
  })
  getHealth(): HealthResponseDto {
    return { status: this.appService.getHealth() };
  }
}
