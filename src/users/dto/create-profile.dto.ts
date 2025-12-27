import {
    IsString,
    IsOptional,
    IsDate,
    IsNumber,
    IsArray,
    Min,
    Max,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiProperty({ description: 'Full name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Birthday (YYYY-MM-DD)',
        example: '1990-03-25',
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthday?: Date;

    @ApiProperty({
        description: 'Gender',
        example: 'Male',
        enum: ['Male', 'Female', 'Other'],
        required: false,
    })
    @IsOptional()
    @IsEnum(['Male', 'Female', 'Other'], {
        message: 'Gender must be Male, Female, or Other',
    })
    gender?: string;

    @ApiProperty({
        description: 'Height in centimeters',
        example: 175,
        minimum: 50,
        maximum: 300,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(50, { message: 'Height must be at least 50 cm' })
    @Max(300, { message: 'Height must not exceed 300 cm' })
    height?: number;

    @ApiProperty({
        description: 'Weight in kilograms',
        example: 70,
        minimum: 20,
        maximum: 500,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(20, { message: 'Weight must be at least 20 kg' })
    @Max(500, { message: 'Weight must not exceed 500 kg' })
    weight?: number;

    @ApiProperty({
        description: 'List of interests',
        example: ['coding', 'music', 'travel'],
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    interests?: string[];

    @ApiProperty({
        description: 'About me section',
        example: 'Software developer passionate about technology',
        required: false,
    })
    @IsOptional()
    @IsString()
    about?: string;

    @ApiProperty({
        description: 'Profile picture URL',
        example: 'https://example.com/avatar.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    profilePicture?: string;
}
