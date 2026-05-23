import {
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'Frontend Team',
  })
  @IsString()
  @Length(2, 50)
  name!: string;

  @ApiPropertyOptional({
    example: 'Engineering workspace for frontend developers',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;
}