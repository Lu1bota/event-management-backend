import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/events.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Participant } from './entities/participants.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['organizer', 'participations'],
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

  async joinEvent(userId: string, eventId: string) {
    const event = await this.getEventById(eventId);

    const isAlreadyJoinedToEvent = this.isAlreadyJoinedToEvent(event, userId);

    if (isAlreadyJoinedToEvent) {
      throw new ConflictException('You have already joined this event');
    }

    const participant = this.participantRepository.create({ userId, eventId });

    return await this.participantRepository.save(participant);
  }

  async leaveEvent(userId: string, eventId: string) {
    const event = await this.getEventById(eventId);

    const isAlreadyJoinedToEvent = this.isAlreadyJoinedToEvent(event, userId);

    if (!isAlreadyJoinedToEvent) {
      throw new BadRequestException('You are not a participant of this event');
    }

    return await this.participantRepository.delete({ userId, eventId });
  }

  private isAlreadyJoinedToEvent(event: Event, userId: string): boolean {
    return event.participations.some((p) => p.userId === userId);
  }
}
