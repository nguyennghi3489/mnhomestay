import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'API health check' })
  getHello(): { message: string; timestamp: string; version: string } {
    return this.appService.getHello();
  }
  
  @Get('health')
  @ApiResponse({ status: 200, description: 'Health check endpoint' })
  healthCheck(): { status: string; timestamp: string } {
    return this.appService.healthCheck();
  }
}
