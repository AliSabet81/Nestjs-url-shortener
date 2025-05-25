import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';

import { app, server } from './setup';

describe('AppController (e2e)', () => {
  beforeEach(async () => {
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect({ data: 'Hello World!' }); // Updated to reflect new data property
  });
});
