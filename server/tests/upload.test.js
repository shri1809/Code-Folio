process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_jwt_secret_key_32chars_long!';
process.env.JWT_REFRESH_SECRET = 'test_refresh_jwt_secret_key_32chars_long!';
process.env.CSRF_SECRET = 'test_csrf_secret_key_32chars_minimum_len!';
process.env.CLIENT_URL = 'http://localhost:5173';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Upload = require('../src/models/Upload');
const { generateAccessToken } = require('../src/services/tokenService');

jest.mock('../src/models/User');
jest.mock('../src/models/Upload');

const mockUserId = new mongoose.Types.ObjectId();
const mockUploadId = new mongoose.Types.ObjectId();
const mockUser = {
  _id: mockUserId,
  id: mockUserId.toString(),
  name: 'Dev Tester',
  username: 'devtester',
  email: 'devtester@example.com',
  role: 'user',
};

const testToken = generateAccessToken(mockUser);
let csrfToken;
let csrfCookie;

beforeAll(async () => {
  // Mock User.findById for requireAuth middleware
  User.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue(mockUser),
  });

  // Get valid CSRF token & cookie
  const csrfRes = await request(app).get('/api/auth/csrf-token');
  csrfToken = csrfRes.body.csrfToken;
  const rawCookies = csrfRes.headers['set-cookie'] || [];
  csrfCookie = rawCookies.map((c) => c.split(';')[0]).join('; ');
});

describe('DIRECT DEVICE IMAGE UPLOADS (/api/upload & /api/uploads)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
  });

  it('should reject unauthenticated upload with 401', async () => {
    const res = await request(app)
      .post('/api/upload/screenshot')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', csrfCookie)
      .attach('image', Buffer.from('mock png bytes'), 'test.png');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject upload without CSRF token with 403', async () => {
    const res = await request(app)
      .post('/api/upload/screenshot')
      .set('Cookie', `accessToken=${testToken}`)
      .attach('image', Buffer.from('mock png bytes'), 'test.png');

    expect(res.status).toBe(403);
  });

  it('should successfully upload an image from device directly into MongoDB and return URL', async () => {
    const imageBuffer = Buffer.from('fake-png-binary-data-for-screenshot');

    Upload.create.mockResolvedValueOnce({
      _id: mockUploadId,
      userId: mockUserId,
      filename: 'my-project-preview.png',
      contentType: 'image/png',
      size: imageBuffer.length,
      data: imageBuffer,
    });

    const res = await request(app)
      .post('/api/upload/screenshot')
      .set('Cookie', `accessToken=${testToken}; ${csrfCookie}`)
      .set('x-csrf-token', csrfToken)
      .attach('image', imageBuffer, {
        filename: 'my-project-preview.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.url).toBe(`/api/uploads/${mockUploadId}`);
    expect(res.body.uploadId).toBe(mockUploadId.toString());

    // Verify public GET retrieval of the uploaded image
    Upload.findById.mockResolvedValueOnce({
      _id: mockUploadId,
      contentType: 'image/png',
      size: imageBuffer.length,
      data: imageBuffer,
    });

    const getRes = await request(app).get(res.body.url);
    expect(getRes.status).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/png');
    expect(getRes.headers['cache-control']).toContain('public');
    expect(getRes.headers['cross-origin-resource-policy']).toBe('cross-origin');
    expect(getRes.body).toEqual(imageBuffer);
  });

  it('should reject non-image file uploads with 400', async () => {
    const res = await request(app)
      .post('/api/upload/screenshot')
      .set('Cookie', `accessToken=${testToken}; ${csrfCookie}`)
      .set('x-csrf-token', csrfToken)
      .attach('image', Buffer.from('alert("evil")'), {
        filename: 'malicious.js',
        contentType: 'application/javascript',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid image ID format', async () => {
    const res = await request(app).get('/api/uploads/invalid-not-an-objectid');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid image identifier');
  });

  it('should return 404 for non-existent image ID', async () => {
    Upload.findById.mockResolvedValueOnce(null);
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/uploads/${nonExistentId}`);
    expect(res.status).toBe(404);
  });
});

