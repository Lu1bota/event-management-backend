import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Participant } from './participants.entity';
import { User } from '../../users/users.entity';

export enum Visibility {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('timestamp with time zone')
  dateTime: Date;

  @Column()
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @Column()
  organizerId: string;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Participant, (participation) => participation.event)
  participations: Participant[];
}
