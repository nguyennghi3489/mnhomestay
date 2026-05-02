import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string; version: string } {
    return {
      message: 'LocalStay API is running! 🏠',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
  
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
