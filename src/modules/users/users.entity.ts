import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Participant } from '../events/entities/participants.entity';
import { Event } from '../events/entities/events.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Participant, (participation) => participation.user)
  participations: Participant[];
}
