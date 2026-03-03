import { DataSource } from 'typeorm';
import { Event } from 'src/modules/events/entities/events.entity';
import { User } from 'src/modules/users/users.entity';
import { eventsData, usersData } from './constatns';

export const runSeed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const eventRepository = dataSource.getRepository(Event);

  const usersCount = await userRepository.count();
  if (usersCount > 0) {
    console.log('Seed data already exists. Skipping seeding...');
    return;
  }

  console.log('Seeding database...');

  const users = userRepository.create(usersData);
  const savedUsers = await userRepository.save(users);

  const eventsToSave = [
    {
      ...eventsData[0],
      organizer: savedUsers[0],
    },
    {
      ...eventsData[1],
      organizer: savedUsers[1],
    },
    {
      ...eventsData[2],
      organizer: savedUsers[2],
    },
  ];

  const events = eventRepository.create(eventsToSave);
  await eventRepository.save(events);

  console.log('Seed data inserted successfully!');
};
