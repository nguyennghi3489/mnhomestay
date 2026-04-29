import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InitializeMonorepoProjectStructureService } from './initialize-monorepo-project-structure.service';

@Controller('initializemonorepoprojectstructure')
export class InitializeMonorepoProjectStructureController {
  constructor(private readonly initializeMonorepoProjectStructureService: InitializeMonorepoProjectStructureService) {}

  @Get()
  findAll() {
    return this.initializeMonorepoProjectStructureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initializeMonorepoProjectStructureService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.initializeMonorepoProjectStructureService.create(createDto);
  }
}