import * as request from 'supertest';
import { server } from '../../../test/setup';

describe(`UrlController (e2e)`, () => {
  const apiKey = 'SECRET';

  describe(`POST /url`, () => {
    it(`should return 401 if no API key is provided`, () => {
      return request(server).post(`/url`).expect(401);
    });
    it(`should return 401 if invalid API key is provided`, () => {
      return request(server)
        .post(`/url`)
        .set('x-api-key', 'INVALID')
        .expect(401);
    });

    it(`should create a URL`, () => {
      return request(server)
        .post(`/url`)
        .send({ title: 'Google', redirect: 'https://google.com' })
        .set('x-api-key', apiKey)
        .expect(201)
        .expect((res) => {
          const { data } = res.body;
          expect(data.title).toEqual('Google');
          expect(data.redirect).toEqual('https://google.com');
          expect(data.description).toBeNull();
        });
    });
    it(`should create a URL with a description`, () => {
      return request(server)
        .post(`/url`)
        .send({
          title: 'Google',
          redirect: 'https://google.com',
          description: 'A search engine',
        })
        .set('x-api-key', apiKey)
        .expect(201)
        .expect((res) => {
          const { data } = res.body;
          expect(data.title).toEqual('Google');
          expect(data.redirect).toEqual('https://google.com');
          expect(data.description).toEqual('A search engine');
        });
    });
    it(`should return a 400 if title and/or redirect are missing`, () => {
      return request(server)
        .post(`/url`)
        .send({
          description: 'A search engine',
        })
        .set('x-api-key', apiKey)
        .expect(400);
    });
    it(`should return a 401 if title and/or redirect are missing`, () => {
      return request(server)
        .post(`/url`)
        .send({
          description: 'A search engine',
        })
        .expect(401);
    });
  });
});
