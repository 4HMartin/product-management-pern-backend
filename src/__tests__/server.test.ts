import request from 'supertest';
import server from '../server';

describe('GET /api', () => {
    test('Should get back a json response', async () => {
        const res = await request(server).get('/api');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.message).toBe('Message from server');
        expect(res.status).not.toBe(404);
    })
})