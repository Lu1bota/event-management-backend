import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from './entities/events.entity';
import type { Request } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved events.',
  })
  async getEvents(): Promise<Event[]> {
    return await this.eventsService.getEvents();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the event.',
  })
  async getEventById(@Param('id') eventId: string): Promise<Event> {
    return await this.eventsService.getEventById(eventId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the event.',
  })
  async createEvent(
    @Req() req: Request,
    @Body() createEventData: CreateEventDto,
  ): Promise<Event> {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    return await this.eventsService.createEvent(userId, createEventData);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an event' })
  @ApiBody({ type: UpdateEventDto })
  async updateEvent(
    @Req() req: Request,
    @Param('id') eventId: string,
    @Body() updateEventData: UpdateEventDto,
  ): Promise<Event> {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    return await this.eventsService.updateEvent(
      userId,
      eventId,
      updateEventData,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an event' })
  async deleteEvent(@Req() req: Request, @Param('id') eventId: string) {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    return await this.eventsService.deleteEvent(userId, eventId);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join an event' })
  async joinEvent(@Req() req: Request, @Param('id') eventId: string) {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    return await this.eventsService.joinEvent(userId, eventId);
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave an event' })
  async leaveEvent(@Req() req: Request, @Param('id') eventId: string) {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    await this.eventsService.leaveEvent(userId, eventId);

    return { message: 'Successfully left the event' };
  }
}
