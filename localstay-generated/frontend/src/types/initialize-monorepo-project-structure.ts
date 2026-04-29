// LocalStay Initialize monorepo project structure - Type definitions

export interface InitializeMonorepoProjectStructure {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add specific fields for Initialize monorepo project structure
}

export type CreateInitializeMonorepoProjectStructureDto = Omit<InitializeMonorepoProjectStructure, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInitializeMonorepoProjectStructureDto = Partial<CreateInitializeMonorepoProjectStructureDto>;