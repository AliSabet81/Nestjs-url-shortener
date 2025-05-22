import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  redirect: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
