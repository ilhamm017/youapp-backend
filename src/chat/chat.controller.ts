import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesDto } from './dto/view-messages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('api')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('sendMessage')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send a message to another user' })
    @ApiResponse({
        status: 201,
        description: 'Message sent successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async sendMessage(@Req() req: any, @Body() sendMessageDto: SendMessageDto) {
        return this.chatService.sendMessage(req.user.userId, sendMessageDto);
    }

    @Get('viewMessages')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'View messages with another user' })
    @ApiQuery({ name: 'otherUserId', required: true, description: 'Other user ID' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Messages per page' })
    @ApiResponse({
        status: 200,
        description: 'Messages retrieved successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request - invalid user ID' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async viewMessages(
        @Req() req: any,
        @Query('otherUserId') otherUserId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const viewMessagesDto: ViewMessagesDto = {
            otherUserId,
            page,
            limit,
        };
        return this.chatService.viewMessages(req.user.userId, viewMessagesDto);
    }

    @Get('conversations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get list of conversations' })
    @ApiResponse({
        status: 200,
        description: 'Conversations retrieved successfully',
    })
    async getConversations(@Req() req: any) {
        return this.chatService.getConversations(req.user.userId);
    }

    @Get('unreadCount')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get unread messages count' })
    @ApiResponse({
        status: 200,
        description: 'Unread count retrieved successfully',
    })
    async getUnreadCount(@Req() req: any) {
        const count = await this.chatService.getUnreadCount(req.user.userId);
        return { unreadCount: count };
    }
}
