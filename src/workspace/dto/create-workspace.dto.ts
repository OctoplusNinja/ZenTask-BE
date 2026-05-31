import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsIn(['free', 'starter', 'business'])
  plan!: string;

  @IsIn(['roadmap', 'sprint', 'marketing', 'blank'])
  template!: string;
}
