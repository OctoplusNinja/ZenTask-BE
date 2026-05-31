import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  wsName!: string;

  @IsString()
  wsSlug!: string;

  @IsIn(['roadmap', 'sprint', 'marketing', 'blank'])
  @IsString()
  template!: string;

  @IsIn(['free', 'starter', 'business'])
  @IsString()
  plan!: string;
}
