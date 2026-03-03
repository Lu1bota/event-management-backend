import { Visibility } from 'src/modules/events/entities/events.entity';

export const usersData = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
  },
];

export const eventsData = [
  {
    title: 'Tech Conference 2026',
    description:
      'A great gathering of tech enthusiasts to discuss NestJS and Docker.',
    dateTime: new Date('2026-05-20T10:00:00Z'),
    location: 'Kyiv, Ukraine',
    capacity: 100,
    visibility: Visibility.PUBLIC,
    organizer: usersData[0],
  },
  {
    title: 'Art Exhibition',
    description: 'Modern art from local artists in a cozy atmosphere.',
    dateTime: new Date('2026-06-15T18:00:00Z'),
    location: 'Lviv, Ukraine',
    capacity: 50,
    visibility: Visibility.PUBLIC,
    organizer: usersData[1],
  },
  {
    title: 'Charity Run',
    description: 'Run for a good cause! All funds go to local shelters.',
    dateTime: new Date('2026-07-01T08:00:00Z'),
    location: 'Odesa, Ukraine',
    capacity: 50,
    visibility: Visibility.PUBLIC,
    organizer: usersData[2],
  },
];
