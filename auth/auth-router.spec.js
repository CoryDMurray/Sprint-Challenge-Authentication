const request = require('supertest');
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

describe('server.js', () => {
  it('should set testing environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('POST /api/auth/register', () => {
    it('should return 201 OK', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'LambdaStudent',
          password: '123abc'
        });
      expect(res.status).toBe(201);
    });

    it('should return JSON', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'Shmo',
          password: 'pass'
        });
      expect(res.type).toBe('application/json');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 401 for non-registered', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'notregistered',
          password: 'notregistered'
        });
      expect(res.status).toBe(401);
    });

    it('should return 200 for registered', async () => {
      const user = {
        username: 'LambdaStudent',
        password: 'abc123'
      }
      const req = await request(server)
        .post('/api/auth/register')
        .send(user);
      
      const res = await request(server)
        .post('/api/auth/login')
        .send(user);
      console.log(res.body); 
      expect(res.status).toBe(200)
    });
  });
});

beforeEach(async () => {
  await db('users').truncate();
});