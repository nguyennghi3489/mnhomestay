import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InitializeMonorepoProjectStructureModule } from './initialize-monorepo-project-structure/initialize-monorepo-project-structure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InitializeMonorepoProjectStructureModule,
  ],
})
export class AppModule {}