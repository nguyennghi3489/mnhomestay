import { Module } from '@nestjs/common';
import { InitializeMonorepoProjectStructureController } from './initialize-monorepo-project-structure.controller';
import { InitializeMonorepoProjectStructureService } from './initialize-monorepo-project-structure.service';

@Module({
  controllers: [InitializeMonorepoProjectStructureController],
  providers: [InitializeMonorepoProjectStructureService],
  exports: [InitializeMonorepoProjectStructureService]
})
export class InitializeMonorepoProjectStructureModule {}