# End-to-End Testing with Playwright - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Implementation](#architecture--implementation)
3. [Setup & Installation](#setup--installation)
4. [Running E2E Tests](#running-e2e-tests)
5. [Test Structure & Patterns](#test-structure--patterns)
6. [Configuration Details](#configuration-details)
7. [Docker Integration](#docker-integration)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Best Practices](#best-practices)
10. [Limitations & Considerations](#limitations--considerations)
11. [Use Cases & Examples](#use-cases--examples)
12. [CI/CD Integration](#cicd-integration)
13. [Extending the Test Suite](#extending-the-test-suite)

---

## Overview

### What is E2E Testing?

End-to-End (E2E) testing validates the complete user journey through your application, simulating real user interactions in actual browsers. Unlike unit or integration tests that test individual components or functions, E2E tests verify that all parts of your system work together correctly from the user's perspective.

### Why Playwright?

**Playwright** is a modern browser automation framework that offers:
- ✅ **Multi-browser support**: Chromium, Firefox, WebKit (Safari)
- ✅ **Cross-platform**: Windows, macOS, Linux
- ✅ **Auto-waiting**: Automatically waits for elements to be ready
- ✅ **Powerful selectors**: CSS, XPath, text, role-based selectors
- ✅ **Rich debugging tools**: Traces, screenshots, videos
- ✅ **Network interception**: Mock APIs, monitor requests
- ✅ **Parallel execution**: Fast test runs
- ✅ **TypeScript support**: First-class TypeScript integration

### What We're Testing

Our E2E test suite validates the core user journey:
1. **User Registration** - New user signup flow
2. **Authentication** - Login/logout functionality
3. **Session Management** - Creating and joining sessions
4. **Problem Selection** - Choosing problems and roles
5. **UI State** - Verifying correct page rendering

---

## Architecture & Implementation

### Project Structure

```
Mettle/
├── e2e/                           # E2E test directory
│   └── full-journey.spec.ts       # Main E2E test suite
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Dependencies & scripts
├── docker-compose.yml             # Services orchestration
└── docs/
    └── E2E-TESTING-GUIDE.md      # This file
```

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| E2E Framework | Playwright | 1.56.1 | Browser automation |
| Test Language | TypeScript | Latest | Type-safe test code |
| Browser | Chromium | Latest | Primary test browser |
| Orchestration | Docker Compose | Latest | Service management |
| Runtime | Node.js | 18+ | JavaScript runtime |

### Test Flow Architecture

```
User Request → Playwright Test
                    ↓
            Playwright Config
                    ↓
         Docker Compose Up
                    ↓
     ┌──────────────┴──────────────┐
     ↓                              ↓
Client (React)              Server (Express)
Port 3000                   Port 5000
     ↓                              ↓
     └──────────────┬──────────────┘
                    ↓
              MongoDB
              Port 27017
                    ↓
          Browser Actions
          (Login, Navigate, etc.)
                    ↓
            Assertions Pass/Fail
```

---

## Setup & Installation

### Prerequisites

1. **Node.js 18+**
   ```powershell
   node --version  # Should be 18.x or higher
   ```

2. **Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop
   - Ensure Docker is running before tests

3. **Git**
   - For cloning the repository

### Installation Steps

#### 1. Install Dependencies

From the project root:

```powershell
# Install all project dependencies
npm install

# This installs @playwright/test automatically
```

#### 2. Install Playwright Browsers

```powershell
# Install all browsers (Chromium, Firefox, WebKit)
npx playwright install

# Or install specific browser only
npx playwright install chromium

# With system dependencies (Linux/WSL)
npx playwright install --with-deps
```

#### 3. Verify Installation

```powershell
# Check Playwright version
npx playwright --version

# Should output: Version 1.56.1
```

#### 4. Test Docker Setup

```powershell
# Verify Docker is running
docker --version

# Test docker-compose
docker-compose --version
```

### Installation Troubleshooting

**Issue**: `Cannot find module '@playwright/test'`
**Solution**: 
```powershell
npm install
npx playwright install
```

**Issue**: Browser download fails
**Solution**:
```powershell
# Clear cache and reinstall
npx playwright install --force
```

**Issue**: Docker not found
**Solution**: Ensure Docker Desktop is running and added to PATH

---

## Running E2E Tests

### Basic Commands

#### Run All E2E Tests
```powershell
npm run test:e2e
```

#### Run with Playwright CLI
```powershell
# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/full-journey.spec.ts

# Run specific test by name
npx playwright test -g "should complete full user journey"
```

### Browser-Specific Tests

```powershell
# Chromium only (fastest)
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only (Safari)
npx playwright test --project=webkit

# Multiple browsers
npx playwright test --project=chromium --project=firefox
```

### Debug Mode

```powershell
# Open Playwright Inspector
npx playwright test --debug

# Debug specific test
npx playwright test --debug -g "full user journey"

# Step through test with UI
npx playwright test --ui
```

### Headed Mode (See Browser)

```powershell
# Run with visible browser
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000
```

### Watch Mode

```powershell
# Re-run tests on file changes
npx playwright test --watch
```

### Generating Reports

```powershell
# Run tests and generate HTML report
npx playwright test --reporter=html

# View the report
npx playwright show-report

# Alternative reporters
npx playwright test --reporter=list    # Detailed list
npx playwright test --reporter=dot     # Minimal output
npx playwright test --reporter=json    # JSON output
```

### Parallel vs Sequential

```powershell
# Run tests in parallel (default)
npx playwright test

# Run tests sequentially
npx playwright test --workers=1

# Run with specific number of workers
npx playwright test --workers=4
```

---

## Test Structure & Patterns

### Test File Structure

```typescript
import { test, expect } from '@playwright/test';

// Test suite (describe block)
test.describe('Feature Name', () => {
  
  // Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  // Individual test
  test('should do something', async ({ page }) => {
    // 1. Navigate
    await page.goto('/');
    
    // 2. Interact
    await page.click('button');
    
    // 3. Assert
    await expect(page).toHaveURL('/expected');
  });
  
  // Cleanup - runs after each test
  test.afterEach(async ({ page }) => {
    // Common cleanup
  });
});
```

### Current Test Suite Analysis

#### Test 1: Full User Journey

**Purpose**: Validates the complete user flow from signup to active session

**Steps**:
```typescript
1. Navigate to signup page
   - Handles redirect from login page
   - Finds signup link dynamically

2. Register new user
   - Generates unique email: testuser_${Date.now()}@example.com
   - Uses secure password
   - Fills all required fields

3. Logout
   - Finds logout button (flexible selectors)
   - Verifies redirect to login

4. Login
   - Uses same credentials
   - Verifies successful authentication

5. Start session
   - Navigates through app flow
   - Finds "New Session" button

6. Select problem & role
   - Clicks problem card
   - Selects role (Student/Teacher)

7. Verify session UI
   - Checks for session indicators
   - Validates successful navigation
```

**Key Features**:
- ✅ Unique test data per run (no conflicts)
- ✅ Flexible selectors (works with UI changes)
- ✅ Error handling with `.catch(() => false)`
- ✅ Dynamic timeouts for reliability

#### Test 2: Login Error Handling

**Purpose**: Ensures invalid credentials show proper errors

**Flow**:
```typescript
1. Navigate to login
2. Enter invalid credentials
3. Verify error message or stay on page
```

**Assertions**:
- Checks for error message in DOM
- Verifies user stays on login page
- Validates no false authentication

#### Test 3: Signup Validation

**Purpose**: Tests form validation on empty submission

**Flow**:
```typescript
1. Navigate to signup
2. Submit empty form
3. Verify validation errors
```

**Assertions**:
- Required field errors shown
- Form submission blocked
- User stays on signup page

### Selector Strategies

#### 1. Text-Based Selectors (Most Flexible)
```typescript
// Matches multiple variations
page.locator('text=/sign up|create account|register/i')

// Case-insensitive
page.locator('button:has-text("Login")')
```

#### 2. Role-Based Selectors (Accessibility)
```typescript
// Best for semantic elements
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
```

#### 3. Name/Type Selectors
```typescript
// Form inputs
page.fill('input[name="email"]')
page.fill('input[type="password"]')
```

#### 4. CSS Selectors
```typescript
// Class-based (less stable)
page.locator('[class*="problem"]')
page.locator('.card').first()
```

#### 5. Fallback Chain
```typescript
// Try multiple selectors
const button = page.locator(
  'button:has-text("Submit"), ' +
  'button[type="submit"], ' +
  'input[type="submit"]'
);
```

### Assertion Patterns

#### Page Navigation
```typescript
// Wait for specific URL pattern
await page.waitForURL(/.*login/, { timeout: 5000 });

// Assert URL contains text
await expect(page).toHaveURL(/.*dashboard/);
```

#### Element Visibility
```typescript
// Wait for element to be visible
await expect(element).toBeVisible({ timeout: 5000 });

// Check if visible (non-blocking)
const isVisible = await element.isVisible().catch(() => false);
```

#### Text Content
```typescript
// Assert text content
await expect(page.locator('h1')).toHaveText('Welcome');

// Contains text
await expect(page).toContainText('Success');
```

#### Element State
```typescript
// Enabled/disabled
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Checked (checkboxes/radio)
await expect(checkbox).toBeChecked();
```

---

## Configuration Details

### playwright.config.ts

#### Full Configuration Breakdown

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory location
  testDir: './e2e',
  
  // Run tests in parallel within files
  fullyParallel: true,
  
  // Prevent test.only in CI
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests in CI
  retries: process.env.CI ? 2 : 0,
  
  // Control parallelism
  workers: process.env.CI ? 1 : undefined,
  
  // Test result reporter
  reporter: 'html',
  
  // Global test options
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Start services before tests
  webServer: {
    command: 'npm run setup:docker',
    url: 'http://localhost:3000',
    timeout: 120 * 1000, // 2 minutes
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `testDir` | `./e2e` | Where test files live |
| `fullyParallel` | `true` | Faster test execution |
| `forbidOnly` | `!!process.env.CI` | Prevent debugging code in CI |
| `retries` | `2` in CI | Handle flaky tests |
| `workers` | `1` in CI | Avoid resource conflicts |
| `reporter` | `html` | Human-readable results |
| `baseURL` | `http://localhost:3000` | Default URL for `page.goto()` |
| `trace` | `on-first-retry` | Debug failed tests |
| `screenshot` | `only-on-failure` | Visual debugging |

#### Device Emulation Options

```typescript
// Mobile devices
use: { ...devices['iPhone 13'] }
use: { ...devices['Pixel 5'] }

// Tablets
use: { ...devices['iPad Pro'] }

// Desktop
use: { ...devices['Desktop Chrome'] }

// Custom viewport
use: {
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
}
```

---

## Docker Integration

### How It Works

Playwright's `webServer` configuration automatically:
1. Runs `npm run setup:docker` before tests
2. Waits for `http://localhost:3000` to respond
3. Times out after 120 seconds
4. Runs tests
5. Keeps services running (or tears down in CI)

### docker-compose.yml

The setup starts:
- **Client** (React) on port 3000
- **Server** (Express) on port 5000
- **MongoDB** on port 27017

### Manual Docker Commands

```powershell
# Start services
npm run setup:docker
# or
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Docker Troubleshooting

**Issue**: Services don't start
```powershell
# Check Docker is running
docker ps

# Rebuild containers
docker-compose down -v
docker-compose up -d --build --force-recreate
```

**Issue**: Port conflicts
```powershell
# Check what's using ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process or change docker-compose ports
```

**Issue**: Timeout waiting for services
```powershell
# Increase timeout in playwright.config.ts
webServer: {
  timeout: 180 * 1000, // 3 minutes
}
```

---

## Debugging & Troubleshooting

### Playwright Inspector

The Inspector is your primary debugging tool:

```powershell
npx playwright test --debug
```

**Features**:
- Step through test execution
- Inspect DOM at each step
- View console logs
- Edit selectors live
- Copy generated code

### Trace Viewer

View detailed traces of test execution:

```powershell
# Run test with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

**Trace includes**:
- Screenshots at each step
- Network requests
- Console logs
- Action timeline
- Source code

### Screenshots on Failure

Screenshots are automatically captured on failure:

```typescript
// In playwright.config.ts
use: {
  screenshot: 'only-on-failure',
}

// Force screenshot in test
await page.screenshot({ path: 'screenshot.png' });
```

### Console Logs

Capture browser console:

```typescript
page.on('console', msg => {
  console.log('Browser log:', msg.text());
});

page.on('pageerror', error => {
  console.log('Browser error:', error);
});
```

### Common Issues

#### Issue: Element not found
```typescript
// Add explicit wait
await page.waitForSelector('button', { timeout: 10000 });

// Use flexible selector
const button = page.locator('button:has-text("Submit")');
await button.waitFor({ state: 'visible' });
```

#### Issue: Test is flaky
```typescript
// Add auto-waiting assertions
await expect(element).toBeVisible({ timeout: 10000 });

// Avoid fixed timeouts
// ❌ Bad
await page.waitForTimeout(1000);

// ✅ Good
await page.waitForLoadState('networkidle');
```

#### Issue: Authentication fails
```typescript
// Check token storage
const token = await page.evaluate(() => localStorage.getItem('token'));
console.log('Token:', token);

// Verify redirect
console.log('Current URL:', page.url());
```

---

## Best Practices

### 1. Use Unique Test Data

```typescript
// ✅ Good - Unique per run
const email = `test_${Date.now()}@example.com`;

// ❌ Bad - Causes conflicts
const email = 'test@example.com';
```

### 2. Flexible Selectors

```typescript
// ✅ Good - Multiple fallbacks
page.locator('button:has-text("Submit"), button[type="submit"]')

// ❌ Bad - Brittle
page.locator('#btn_submit_form_12345')
```

### 3. Explicit Waits

```typescript
// ✅ Good - Wait for condition
await expect(page.locator('h1')).toBeVisible();

// ❌ Bad - Fixed delay
await page.waitForTimeout(3000);
```

### 4. Meaningful Test Names

```typescript
// ✅ Good
test('should show error when login with invalid credentials', ...)

// ❌ Bad
test('test 1', ...)
```

### 5. Page Object Pattern (For Large Suites)

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// test file
const loginPage = new LoginPage(page);
await loginPage.login(email, password);
```

### 6. Test Isolation

```typescript
// Each test should be independent
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  // Cleanup
  await page.evaluate(() => localStorage.clear());
});
```

### 7. Error Handling

```typescript
// Handle optional elements
const modal = page.locator('.modal');
if (await modal.isVisible().catch(() => false)) {
  await modal.locator('.close').click();
}
```

---

## Limitations & Considerations

### Performance

| Aspect | Impact | Mitigation |
|--------|--------|------------|
| Docker startup | 30-60s overhead | Use `reuseExistingServer: true` locally |
| Full browser | Slower than unit tests | Run in parallel with `fullyParallel: true` |
| Network requests | Real latency | Use network interception for speed |

### Stability

**Flaky Tests**:
- Network timing issues
- Animation delays
- Race conditions

**Solutions**:
- Use Playwright's auto-waiting
- Add explicit assertions
- Enable retries in CI

### Maintenance

**UI Changes Break Tests**:
- Selectors become outdated
- Flow changes require updates

**Solutions**:
- Use semantic selectors (role, text)
- Implement Page Object pattern
- Regular test review

### Coverage Gaps

**What E2E Doesn't Test**:
- Edge cases (unit tests better)
- Internal state (integration tests better)
- Performance (load testing needed)
- Security vulnerabilities (security testing needed)

### Resource Requirements

**System Needs**:
- Docker Desktop (4GB+ RAM recommended)
- Disk space for browser binaries (~1GB)
- Network for Docker pulls

---

## Use Cases & Examples

### Use Case 1: Authentication Flow

```typescript
test('complete authentication flow', async ({ page }) => {
  // Signup
  await page.goto('/signup');
  await page.fill('[name="email"]', `user_${Date.now()}@test.com`);
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  // Verify logged in
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('text=Welcome')).toBeVisible();
  
  // Logout
  await page.click('button:has-text("Logout")');
  
  // Verify logged out
  await expect(page).toHaveURL(/.*login/);
});
```

### Use Case 2: Form Validation

```typescript
test('validates required fields', async ({ page }) => {
  await page.goto('/signup');
  
  // Submit empty form
  await page.click('button[type="submit"]');
  
  // Check validation messages
  await expect(page.locator('text=Email is required')).toBeVisible();
  await expect(page.locator('text=Password is required')).toBeVisible();
  
  // Fill invalid email
  await page.fill('[name="email"]', 'invalid-email');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Invalid email')).toBeVisible();
});
```

### Use Case 3: Session Management

```typescript
test('creates and joins session', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'teacher@test.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Create session
  await page.click('button:has-text("New Session")');
  await page.fill('[name="sessionName"]', 'Test Session');
  await page.click('button:has-text("Create")');
  
  // Verify session created
  await expect(page.locator('text=Test Session')).toBeVisible();
  
  // Get session code
  const sessionCode = await page.locator('.session-code').textContent();
  
  // Open new context (different user)
  const studentContext = await page.context().browser()!.newContext();
  const studentPage = await studentContext.newPage();
  
  // Join as student
  await studentPage.goto('/login');
  await studentPage.fill('[name="email"]', 'student@test.com');
  await studentPage.fill('[name="password"]', 'password');
  await studentPage.click('button[type="submit"]');
  
  await studentPage.click('button:has-text("Join Session")');
  await studentPage.fill('[name="sessionCode"]', sessionCode!);
  await studentPage.click('button:has-text("Join")');
  
  // Verify student joined
  await expect(studentPage.locator('text=Test Session')).toBeVisible();
});
```

### Use Case 4: Network Interception

```typescript
test('handles API errors gracefully', async ({ page }) => {
  // Intercept API call and return error
  await page.route('**/api/login', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  // Attempt login
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Verify error message
  await expect(page.locator('text=Server error')).toBeVisible();
});
```

### Use Case 5: File Upload

```typescript
test('uploads problem image', async ({ page }) => {
  await page.goto('/problems/create');
  
  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-files/diagram.png');
  
  // Verify preview
  await expect(page.locator('img[alt="Preview"]')).toBeVisible();
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify uploaded
  await expect(page.locator('text=Problem created')).toBeVisible();
});
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-traces
          path: test-results/
          retention-days: 30
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.56.1-focal
  stage: test
  script:
    - npm ci
    - npx playwright install
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 1 week
```

### Jenkins

```groovy
pipeline {
  agent any
  
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }
    
    stage('E2E Tests') {
      steps {
        sh 'npm run test:e2e'
      }
    }
  }
  
  post {
    always {
      publishHTML([
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Report'
      ])
    }
  }
}
```

---

## Extending the Test Suite

### Adding New Test Files

1. Create file in `e2e/` directory:
```typescript
// e2e/problem-selection.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Problem Selection', () => {
  test('should display available problems', async ({ page }) => {
    // Test implementation
  });
});
```

2. Run new tests:
```powershell
npx playwright test e2e/problem-selection.spec.ts
```

### Creating Helper Functions

```typescript
// e2e/helpers/auth.ts
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}

// Usage in test
import { login } from './helpers/auth';
test('some test', async ({ page }) => {
  await login(page, 'user@test.com', 'password');
  // Continue test...
});
```

### Adding Test Fixtures

```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: login before test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
    
    // Use the authenticated page in test
    await use(page);
    
    // Teardown: logout after test
    await page.click('button:has-text("Logout")');
  },
});

// Usage
import { test } from './fixtures';
test('needs auth', async ({ authenticatedPage }) => {
  // Already logged in!
});
```

### Testing Socket.IO Events

```typescript
test('receives real-time updates', async ({ page }) => {
  // Listen for WebSocket messages
  await page.evaluate(() => {
    window.socketMessages = [];
    // Assuming socket is exposed globally
    window.socket.on('session-update', (data) => {
      window.socketMessages.push(data);
    });
  });
  
  // Trigger action that emits socket event
  await page.click('button:has-text("Start Problem")');
  
  // Wait for socket message
  await page.waitForFunction(() => window.socketMessages.length > 0);
  
  // Verify message content
  const messages = await page.evaluate(() => window.socketMessages);
  expect(messages[0]).toHaveProperty('status', 'started');
});
```

---

## Performance Optimization

### Parallel Execution

```typescript
// Run all tests in parallel (default)
test.describe.configure({ mode: 'parallel' });

// Run tests in serial (when needed)
test.describe.configure({ mode: 'serial' });
```

### Shared Context

```typescript
// Share browser context between tests (faster, but less isolated)
test.describe('Fast tests', () => {
  let sharedPage: Page;
  
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
  });
  
  test('test 1', async () => {
    await sharedPage.goto('/');
  });
  
  test('test 2', async () => {
    await sharedPage.goto('/about');
  });
});
```

### Skip Unnecessary Waits

```typescript
// Disable waiting for fonts, images (if not needed)
const page = await context.newPage();
await page.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2}', route => route.abort());
```

---

## Conclusion

This E2E testing setup provides:
- ✅ Comprehensive user journey validation
- ✅ Multi-browser testing capabilities
- ✅ Docker integration for realistic environments
- ✅ Powerful debugging tools
- ✅ CI/CD ready configuration
- ✅ Extensible architecture

For questions or issues, refer to:
- [Playwright Documentation](https://playwright.dev)
- [Project Issues](https://github.com/usd-cs-research/Mettle/issues)
- This guide's troubleshooting section

**Happy Testing! 🎭**
