import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { Participant } from './entities/participants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Participant])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
