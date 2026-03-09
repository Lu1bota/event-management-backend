import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/events.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new UnauthorizedException('Event not found');

    return event;
  }

  async createEvent(userId: string, eventData: CreateEventDto): Promise<Event> {
    if (eventData.dateTime < new Date()) {
      throw new UnauthorizedException('Event date must be in the future');
    }

    const event = this.eventRepository.create({
      ...eventData,
      organizerId: userId,
    });

    return await this.eventRepository.save(event);
  }

  async updateEvent(
    userId: string,
    eventId: string,
    eventData: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.getEventById(eventId);

    if (event.organizerId !== userId) {
      throw new UnauthorizedException(
        'You are not the organizer of this event',
      );
    }

    return await this.eventRepository.save({ ...event, ...eventData });
  }

  async deleteEvent(userId: string, eventId: string) {
    const event = await this.getEventById(eventId);

    if (event.organizerId !== userId) {
      throw new UnauthorizedException(
        'You are not the organizer of this event',
      );
    }

    return await this.eventRepository.delete({
      id: eventId,
      organizerId: userId,
    });
  }
}
