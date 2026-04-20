import { User } from '../../users/users.entity';
import { Entity, ManyToOne, PrimaryColumn, Column, JoinColumn } from 'typeorm';
import { Event } from './events.entity';

@Entity('participants')
export class Participant {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  eventId: string;

  @Column({ default: () => 'NOW()' })
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.participations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Event, (event) => event.participations)
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
