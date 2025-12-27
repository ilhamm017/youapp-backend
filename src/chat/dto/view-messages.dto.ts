import { IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ViewMessagesDto {
    @ApiProperty({
        description: 'Other user ID to view conversation with',
        example: '507f1f77bcf86cd799439011',
    })
    @IsMongoId({ message: 'User ID must be a valid MongoDB ObjectId' })
    otherUserId: string;

    @ApiProperty({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: 'Number of messages per page',
        example: 20,
        minimum: 1,
        required: false,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;
}
