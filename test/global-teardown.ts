import { existsSync, renameSync } from 'fs';

export default () => {
  if (existsSync('.env.temp')) {
    renameSync('.env.temp', '.env');
  }
};
