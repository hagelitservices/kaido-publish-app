import { Controller, Get } from '@nestjs/common';
@Controller('/')
export class RootController {
  @Get('/')
  getRoot(): string {
    return 'OK'; // Kaido (I14f): neutral, no upstream greeting
  }
}
