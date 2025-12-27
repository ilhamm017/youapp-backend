import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users & Profile')
@Controller('api')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('createProfile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update user profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile created/updated successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createProfile(@Req() req: any, @Body() createProfileDto: CreateProfileDto) {
        return this.usersService.createProfile(req.user.userId, createProfileDto);
    }

    @Get('getProfile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiQuery({
        name: 'username',
        required: false,
        description: 'Username to fetch profile (defaults to authenticated user)',
    })
    @ApiResponse({
        status: 200,
        description: 'Profile retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getProfile(@Req() req: any, @Query('username') username?: string) {
        const identifier = username || req.user.userId;
        return this.usersService.getProfile(identifier);
    }

    @Put('updateProfile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile updated successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }
}
