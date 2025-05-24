import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetUrlsDto {
  @IsString()
  @IsOptional()
  filter?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  limit?: number;
}
