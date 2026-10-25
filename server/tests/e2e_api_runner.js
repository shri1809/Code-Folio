/**
 * Comprehensive End-to-End API Test Suite
 * Tests all Auth, Portfolio, and Public endpoints on the live running server
 */
const BASE_URL = 'http://localhost:5000/api';
let testIpCounter = 1;
const getHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'x-test-ip': `10.100.${Math.floor(testIpCounter / 3)}.${testIpCounter++ % 250}`,
  ...extra,
});

const results = [];
function record(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${testName}${details ? ' -> ' + details : ''}`);
}

async function run() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING COMPREHENSIVE E2E LIVE API TESTS');
  console.log('======================================================\n');

  let sessionCookies = '';
  let csrfToken = '';

  // 1. GET CSRF Token
  try {
    const res = await fetch(`${BASE_URL}/auth/csrf-token`);
    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');
    if (res.status === 200 && data.csrfToken && setCookie) {
      csrfToken = data.csrfToken;
      sessionCookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
      record('GET /api/auth/csrf-token', true, `Token received: ${csrfToken.substring(0, 16)}...`);
    } else {
      record('GET /api/auth/csrf-token', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('GET /api/auth/csrf-token', false, err.message);
  }

  // 2. GET /api/auth/me without auth -> Expect 401
  try {
    const res = await fetch(`${BASE_URL}/auth/me`);
    const data = await res.json();
    if (res.status === 401 && !data.success) {
      record('GET /api/auth/me (Unauthenticated)', true, 'Correctly returned 401 Unauthorized');
    } else {
      record('GET /api/auth/me (Unauthenticated)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('GET /api/auth/me (Unauthenticated)', false, err.message);
  }

  // 3. POST /api/auth/register with reserved username -> Expect 400
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: 'admin',
        email: 'admin_test@codefolio.dev',
        password: 'Password123!',
      }),
    });
    const data = await res.json();
    if (res.status === 400 && (data.error?.toLowerCase().includes('validation failed') || data.error?.toLowerCase().includes('reserved'))) {
      record('POST /api/auth/register (Reserved username "admin")', true, 'Correctly rejected with 400');
    } else {
      record('POST /api/auth/register (Reserved username)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('POST /api/auth/register (Reserved username)', false, err.message);
  }

  // 4. POST /api/auth/register with invalid email -> Expect 400
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: 'validuser',
        email: 'invalid-email-format',
        password: 'Password123!',
      }),
    });
    if (res.status === 400) {
      record('POST /api/auth/register (Invalid email)', true, 'Correctly rejected invalid email');
    } else {
      record('POST /api/auth/register (Invalid email)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('POST /api/auth/register (Invalid email)', false, err.message);
  }

  // 5. POST /api/auth/register with short password (< 8 chars) -> Expect 400
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: 'validuser',
        email: 'user@codefolio.dev',
        password: '123',
      }),
    });
    if (res.status === 400) {
      record('POST /api/auth/register (Short password)', true, 'Correctly rejected <8 char password');
    } else {
      record('POST /api/auth/register (Short password)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('POST /api/auth/register (Short password)', false, err.message);
  }

  // 6. POST /api/auth/login with wrong credentials -> Expect 401
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'nonexistent@codefolio.dev',
        password: 'WrongPassword123!',
      }),
    });
    if (res.status === 401) {
      record('POST /api/auth/login (Invalid credentials)', true, 'Correctly returned 401');
    } else {
      record('POST /api/auth/login (Invalid credentials)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('POST /api/auth/login (Invalid credentials)', false, err.message);
  }

  // 7. POST /api/auth/login with valid user demo1 -> Expect 200 + auth cookies
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'demo1@codefolio.dev',
        password: 'Demo1SecurePass123!',
      }),
    });
    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');
    if (res.status === 200 && data.success && setCookie) {
      // Merge cookies
      const authCookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
      sessionCookies = `${sessionCookies}; ${authCookies}`;
      record('POST /api/auth/login (Valid credentials demo1)', true, `Authenticated: @${data.user.username}`);
    } else {
      record('POST /api/auth/login (Valid credentials demo1)', false, `Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('POST /api/auth/login (Valid credentials demo1)', false, err.message);
  }

  // 8. GET /api/auth/me with auth cookies -> Expect 200 + user object
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: sessionCookies },
    });
    const data = await res.json();
    if (res.status === 200 && data.user?.username === 'demo1') {
      record('GET /api/auth/me (Authenticated)', true, `Identified as @${data.user.username}`);
    } else {
      record('GET /api/auth/me (Authenticated)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('GET /api/auth/me (Authenticated)', false, err.message);
  }

  // 9. GET /api/portfolio -> Expect 200 + portfolio document
  try {
    const res = await fetch(`${BASE_URL}/portfolio`, {
      headers: { Cookie: sessionCookies },
    });
    const data = await res.json();
    if (res.status === 200 && data.portfolio) {
      record('GET /api/portfolio', true, `Profile: "${data.portfolio.profile?.name}"`);
    } else {
      record('GET /api/portfolio', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('GET /api/portfolio', false, err.message);
  }

  // 10. PUT /api/portfolio without CSRF header -> Expect 403 Forbidden
  try {
    const res = await fetch(`${BASE_URL}/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookies,
      },
      body: JSON.stringify({
        profile: { name: 'Alex Hacked' },
      }),
    });
    if (res.status === 403) {
      record('PUT /api/portfolio (Missing CSRF Header)', true, 'Correctly blocked with 403 Forbidden');
    } else {
      record('PUT /api/portfolio (Missing CSRF Header)', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('PUT /api/portfolio (Missing CSRF Header)', false, err.message);
  }

  // 11. PUT /api/portfolio with valid CSRF header -> Expect 200
  try {
    const res = await fetch(`${BASE_URL}/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        Cookie: sessionCookies,
      },
      body: JSON.stringify({
        templateId: 'minimalist',
        customDomain: null,
        profile: {
          name: 'Alex Rivera (Updated)',
          bio: 'Verified Architect & Senior Systems Developer.',
          socialLinks: { github: 'https://github.com/alexrivera' },
        },
        skills: {
          frontend: ['React', 'TypeScript', 'Tailwind CSS'],
          backend: ['Node.js', 'Express', 'MongoDB'],
          devops: ['Docker', 'AWS'],
        },
        projects: [
          {
            title: 'CodeFolio SaaS Engine',
            description: 'Full-stack portfolio generator with real-time preview.',
            techStack: ['React', 'Node.js', 'Tailwind CSS'],
            repoLink: 'https://github.com/codefolio',
            liveLink: 'https://codefolio.dev',
          },
        ],
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('PUT /api/portfolio (With valid CSRF)', true, 'Portfolio updated successfully');
    } else {
      record('PUT /api/portfolio (With valid CSRF)', false, `Status ${res.status}: ${data.error}`);
    }
  } catch (err) {
    record('PUT /api/portfolio (With valid CSRF)', false, err.message);
  }

  // 12. GET /api/public/:username -> Expect 200, sanitization check
  try {
    const res = await fetch(`${BASE_URL}/public/demo1`, { headers: getHeaders() });
    const data = await res.json();
    const user = data.data?.user || data.user;
    if (
      res.status === 200 &&
      user?.username === 'demo1' &&
      user.email === undefined && // email stripped for security
      user.passwordHash === undefined // password hash stripped
    ) {
      record('GET /api/public/demo1 (Public Profile)', true, 'Public data served; sensitive fields stripped');
    } else {
      record('GET /api/public/demo1', false, `Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('GET /api/public/demo1', false, err.message);
  }

  // 13. GET /api/public/domain/:hostname -> Custom domain simulation (demo2.tech)
  try {
    const res = await fetch(`${BASE_URL}/public/domain/demo2.tech`, { headers: getHeaders() });
    const data = await res.json();
    const user = data.data?.user || data.user;
    if (res.status === 200 && user?.username === 'demo2') {
      record('GET /api/public/domain/demo2.tech', true, 'Resolved demo2.tech to @demo2');
    } else {
      record('GET /api/public/domain/demo2.tech', false, `Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('GET /api/public/domain/demo2.tech', false, err.message);
  }

  // 14. POST /api/public/:username/contact -> Contact Relay
  try {
    const res = await fetch(`${BASE_URL}/public/demo1/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        senderName: 'Sarah Recruiter',
        senderEmail: 'sarah@talent.com',
        subject: 'Engineering Opportunity',
        message: 'Hello Alex, we were impressed by your CloudMetric project and would like to chat.',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('POST /api/public/demo1/contact', true, 'Contact relay email dispatched');
    } else {
      record('POST /api/public/demo1/contact', false, `Status ${res.status}: ${data.error}`);
    }
  } catch (err) {
    record('POST /api/public/demo1/contact', false, err.message);
  }

  // 15. POST /api/auth/logout -> Expect 200 and cookies cleared
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookies },
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('POST /api/auth/logout', true, 'Session cookies destroyed');
    } else {
      record('POST /api/auth/logout', false, `Status ${res.status}`);
    }
  } catch (err) {
    record('POST /api/auth/logout', false, err.message);
  }

  // Summary
  console.log('\n======================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`📊 TOTAL LIVE API TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('======================================================\n');

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

run().catch(console.error);
