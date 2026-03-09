import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Visibility } from '../entities/events.entity';

export class CreateEventDto {
  @ApiProperty({
    example: 'Tech Conference 2025',
    description: 'The title of the event',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(30, { message: 'Title must be at most 30 characters' })
  title: string;

  @ApiProperty({
    example: 'A conference about the latest trends in technology',
    description: 'A detailed description of the event',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(150, { message: 'Description must be at most 150 characters' })
  description: string;

  @ApiProperty({
    example: '2025-06-15T10:00:00.000Z',
    description: 'The date and time of the event in ISO 8601 format',
  })
  @Type(() => Date)
  @IsDate({ message: 'DateTime must be a valid date' })
  @IsNotEmpty({ message: 'DateTime is required' })
  dateTime: Date;

  @ApiProperty({
    example: 'Kyiv, Ukraine',
    description: 'The location where the event will take place',
  })
  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Maximum number of participants (leave empty for unlimited)',
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Capacity must be an integer' })
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity?: number;

  @ApiPropertyOptional({
    example: Visibility.PUBLIC,
    description: 'Visibility of the event',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(Visibility, { message: 'Visibility must be Public or Private' })
  visibility?: Visibility;
}
