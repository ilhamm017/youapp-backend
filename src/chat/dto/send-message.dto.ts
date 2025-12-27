import { IsNotEmpty, IsString, MinLength, MaxLength, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({
        description: 'Receiver user ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @IsNotEmpty({ message: 'Receiver ID is required' })
    @IsMongoId({ message: 'Receiver ID must be a valid MongoDB ObjectId' })
    receiverId: string;

    @ApiProperty({
        description: 'Message content',
        example: 'Hello! How are you?',
        minLength: 1,
        maxLength: 5000,
    })
    @IsNotEmpty({ message: 'Message content is required' })
    @IsString()
    @MinLength(1, { message: 'Message must not be empty' })
    @MaxLength(5000, { message: 'Message must not exceed 5000 characters' })
    content: string;

    @ApiProperty({
        description: 'Parent message ID for threading (optional)',
        example: '507f1f77bcf86cd799439011',
        required: false,
    })
    @IsOptional()
    @IsMongoId({ message: 'Parent message ID must be a valid MongoDB ObjectId' })
    parentMessageId?: string;
}
