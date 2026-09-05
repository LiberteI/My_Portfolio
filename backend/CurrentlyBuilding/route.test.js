import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createBuildingRouter } from './route.js';
import Session from '../DatabaseModel/Session.js';
import { getSessionUser, createSession, logoutSession } from '../Middleware/session.js';

const id = '507f1f77bcf86cd799439011';
const data = { title: 'Project', description: 'Building something', status: 'In progress', url: 'https://example.com' };

test('public reads, protected writes, validation, and complete CRUD', async (t) => {
    let records = [];
    const model = {
        find: () => ({ sort: () => ({ lean: async () => records }) }),
        create: async (body) => { const record = { ...body, _id: id }; records.push(record); return record; },
        findByIdAndUpdate: async (key, body) => {
            if (!records.some(record => record._id === key)) return null;
            records = [{ ...body, _id: key }]; return records[0];
        },
        findByIdAndDelete: async (key) => { const record = records.find(record => record._id === key); records = []; return record; },
    };
    const app = express();
    app.use(express.json());
    app.use(createBuildingRouter({ model, authenticate: (req, res, next) => {
        if (!req.headers.authorization) return res.sendStatus(401);
        req.user = { isAdmin: req.headers.authorization === 'admin' }; next();
    } }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => { server.closeAllConnections(); server.close(); });
    const request = (method, path = '/', body = data, role) => fetch(`http://127.0.0.1:${server.address().port}${path}`, {
        method, headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: role } : {}) },
        ...(method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    });
    assert.equal((await request('GET')).status, 200);
    for (const [method, path] of [['POST', '/'], ['PUT', `/${id}`], ['DELETE', `/${id}`]]) {
        assert.equal((await request(method, path)).status, 401);
        assert.equal((await request(method, path, data, 'guest')).status, 403);
    }
    assert.equal(records.length, 0);
    assert.equal((await request('POST', '/', { ...data, url: 'javascript:alert(1)' }, 'admin')).status, 400);
    assert.equal((await request('POST', '/', { ...data, title: '  ' }, 'admin')).status, 400);
    assert.equal((await request('POST', '/', { ...data, status: 'unknown' }, 'admin')).status, 400);
    assert.equal((await request('POST', '/', { ...data, isAdmin: true }, 'admin')).status, 201);
    assert.equal(records[0].isAdmin, undefined);
    assert.equal((await (await request('GET')).json()).length, 1);
    assert.equal((await request('PUT', `/${id}`, { ...data, title: 'Updated' }, 'admin')).status, 200);
    assert.equal(records[0].title, 'Updated');
    assert.equal((await request('DELETE', '/invalid', {}, 'admin')).status, 400);
    assert.equal((await request('DELETE', `/${id}`, {}, 'admin')).status, 204);
    assert.equal(records.length, 0);
    assert.equal((await request('PUT', `/${id}`, data, 'admin')).status, 404);
    assert.equal((await request('DELETE', `/${id}`, {}, 'admin')).status, 404);
});

test('sessions reject raw IDs, unknown tokens and expiry; issue opaque cookies and revoke on logout', async (t) => {
    assert.equal(await getSessionUser(id), null);
    assert.equal(await getSessionUser(undefined), null);
    let query;
    t.mock.method(Session, 'findOne', (filter) => {
        query = filter;
        return { populate: () => ({ lean: async () => null }) };
    });
    assert.equal(await getSessionUser('a'.repeat(64)), null);
    assert.ok(query.expiresAt.$gt instanceof Date);
    assert.notEqual(query.tokenHash, 'a'.repeat(64));
    let stored, cookie;
    t.mock.method(Session, 'create', async value => { stored = value; });
    await createSession({ cookie: (...args) => { cookie = args; } }, { _id: id });
    assert.match(cookie[1], /^[a-f0-9]{64}$/);
    assert.notEqual(stored.tokenHash, cookie[1]);
    assert.equal(cookie[2].httpOnly, true);
    assert.equal(stored.user, id);
    let deleted;
    t.mock.method(Session, 'deleteOne', async filter => { deleted = filter; });
    await logoutSession({ cookies: { auth: cookie[1] } }, { clearCookie: () => {}, sendStatus: status => assert.equal(status, 204) });
    assert.equal(deleted.tokenHash, stored.tokenHash);
});

test('authentication resolves the server session and enforces the database admin role', async (t) => {
    const { requireAuth, requireAdmin } = await import('../Middleware/auth.js');
    let sessionUser = null;
    t.mock.method(Session, 'findOne', () => ({ populate: () => ({ lean: async () => sessionUser ? { user: sessionUser } : null }) }));
    let status, allowed;
    const res = { sendStatus: value => { status = value; } };
    const run = async token => {
        status = null; allowed = false;
        const req = { cookies: { auth: token } };
        await requireAuth(req, res, () => requireAdmin(req, res, () => { allowed = true; }));
    };
    await run(id);
    assert.equal(status, 401);
    await run('a'.repeat(64));
    assert.equal(status, 401);
    sessionUser = { _id: id, isAdmin: false };
    await run('a'.repeat(64));
    assert.equal(status, 403);
    sessionUser = { _id: id, isAdmin: true };
    await run('a'.repeat(64));
    assert.equal(allowed, true);
});
