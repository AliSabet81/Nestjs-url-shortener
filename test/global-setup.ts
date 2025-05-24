import { existsSync, renameSync } from 'fs';

export default () => {
  if (existsSync('.env')) {
    renameSync('.env', '.env.temp');
  }
};
