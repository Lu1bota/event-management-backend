import { AppDataSource } from '../data-source';
import { runSeed } from './initial-seeds';

const run = async () => {
  try {
    await AppDataSource.initialize();
    await runSeed(AppDataSource);
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

run();
