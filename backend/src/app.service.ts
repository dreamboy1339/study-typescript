import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // 안드로이드 비유: ViewModel에서 LiveData처럼 단순 상태 값을 내려주는 메서드
  getHealth(): string {
    return 'ok';
  }
}
