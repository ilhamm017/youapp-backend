import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Username or email',
        example: 'johndoe',
    })
    @IsString()
    @IsNotEmpty({ message: 'Username or email is required' })
    usernameOrEmail: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password123!',
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
