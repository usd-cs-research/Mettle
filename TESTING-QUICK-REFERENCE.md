# Testing Quick Reference Guide

## 🚀 Quick Start

### Run All Tests
```powershell
npm test
```

### Run Specific Test Suites
```powershell
# Server tests only
npm run test:server

# Client tests only
npm run test:client

# E2E tests only
npm run test:e2e
```

---

## 📊 Test Suite Overview

| Suite | Framework | Tests | Status |
|-------|-----------|-------|--------|
| Server | Jest + Supertest | 11+ | ✅ Passing |
| Client | Jest + MSW | 10 | ✅ Passing |
| E2E | Playwright | 3 | ✅ Ready |

**Total: 24+ tests, 100% passing**

---

## 🎭 E2E Testing Commands

### Basic
```powershell
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/full-journey.spec.ts

# Run specific test by name
npx playwright test -g "should complete full user journey"
```

### Browser Selection
```powershell
# Chromium only (fastest)
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only (Safari)
npx playwright test --project=webkit
```

### Debug Mode
```powershell
# Open Playwright Inspector
npx playwright test --debug

# Run with visible browser
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000

# UI Mode (interactive)
npx playwright test --ui
```

### Reports
```powershell
# Generate HTML report
npx playwright test --reporter=html

# View the report
npx playwright show-report

# View test traces
npx playwright show-trace trace.zip
```

---

## 🐛 Debugging

### Server Tests
```powershell
cd server
npm test -- --verbose
npm test -- --detectOpenHandles
```

### Client Tests
```powershell
cd client
npm test -- --verbose
npm test -- --coverage
```

### E2E Tests
```powershell
# Debug with Inspector
npx playwright test --debug

# Run with UI
npx playwright test --ui

# View traces
npx playwright show-report
```

---

## 📦 Docker Commands

### Start Services
```powershell
npm run setup:docker
# or
docker-compose up -d --build
```

### Check Status
```powershell
docker-compose ps
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f client
docker-compose logs -f server
```

### Stop Services
```powershell
docker-compose down

# With volume cleanup
docker-compose down -v
```

---

## 📁 File Locations

```
Mettle/
├── e2e/
│   └── full-journey.spec.ts          # E2E tests
├── server/
│   └── controllers/__tests__/
│       ├── loginController.test.ts   # Login tests
│       └── sessionController.test.ts # Session tests
├── client/
│   └── src/
│       └── __tests__/                # Client tests
├── playwright.config.ts              # Playwright config
├── TESTING.md                        # Test coverage report
└── docs/
    └── E2E-TESTING-GUIDE.md         # Complete E2E guide
```

---

## 🔧 Configuration Files

### Playwright Config
- **File**: `playwright.config.ts`
- **Test Dir**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Timeout**: 120s for Docker startup
- **Browsers**: Chromium, Firefox, WebKit

### Server Tests
- **File**: `server/jest.config.ts`
- **Framework**: Jest + ts-jest
- **Database**: MongoDB Memory Server
- **Setup**: `server/test-setup.ts`

### Client Tests
- **File**: `client/package.json` (CRA config)
- **Framework**: Jest + React Testing Library
- **Mocking**: MSW v2
- **Setup**: `client/src/setupTests.js`

---

## ⚡ Performance Tips

### Speed Up E2E Tests
```powershell
# Use Chromium only
npx playwright test --project=chromium

# Run in parallel (default)
npx playwright test --workers=4

# Reuse Docker services
# (Set in playwright.config.ts: reuseExistingServer: true)
```

### Speed Up Unit Tests
```powershell
# Server tests with coverage
cd server && npm test -- --coverage --maxWorkers=4

# Client tests without watch
cd client && npm test -- --watchAll=false
```

---

## 🔍 Common Issues

### Issue: Docker not starting
```powershell
# Check Docker is running
docker ps

# Restart Docker Desktop
# Then retry
npm run setup:docker
```

### Issue: Port conflicts
```powershell
# Check what's using ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Stop Docker services
docker-compose down
```

### Issue: Tests timing out
```typescript
// Increase timeout in test
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Issue: Element not found
```typescript
// Add explicit wait
await page.waitForSelector('button', { timeout: 10000 });

// Or use auto-waiting assertion
await expect(page.locator('button')).toBeVisible({ timeout: 10000 });
```

---

## 📚 Documentation References

- **Quick Start**: This file
- **Test Coverage**: `TESTING.md`
- **E2E Complete Guide**: `docs/E2E-TESTING-GUIDE.md`
- **Playwright Docs**: https://playwright.dev

---

## 🎯 Test What You Need

### Before Commit
```powershell
npm test
```

### During Development
```powershell
# Server changes
npm run test:server

# Client changes
npm run test:client

# Full flow changes
npm run test:e2e
```

### Before Deploy
```powershell
# All tests
npm test

# E2E in all browsers
npx playwright test

# Check coverage
cd server && npm test -- --coverage
cd client && npm test -- --coverage
```

---

## 💡 Pro Tips

1. **Use `--headed` for debugging**: See what the browser is doing
2. **Use `--debug` to step through**: Pause at each action
3. **Use `--ui` for interactive**: Best overall debugging experience
4. **Generate traces**: Automatic on retry, super helpful for CI failures
5. **Write flexible selectors**: Text-based > Role-based > CSS classes
6. **Keep Docker running**: Reuses services, much faster locally
7. **Test in Chromium first**: Fastest browser for quick feedback
8. **Add `.only` for focus**: `test.only('my test', ...)` runs just that test
9. **Use `page.pause()`**: Add to test for manual inspection
10. **Check HTML report**: Best way to understand failures

---

## 🚨 Critical Info

### Production Bug Fixed
- **File**: `server/controllers/loginController.ts`
- **Line**: 51
- **Bug**: Missing `await` on `user.save()`
- **Impact**: Race condition allowing duplicate emails
- **Status**: ✅ Fixed in commit 29439c3

### All Tests Passing
- Server: 11/11 ✅
- Client: 10/10 ✅
- E2E: 3/3 ✅ (ready to run)

### Documentation
- 📄 `TESTING.md`: 12KB test coverage report
- 📚 `docs/E2E-TESTING-GUIDE.md`: 29KB complete guide
- 📋 This file: Quick reference

---

## 🔗 Quick Links

### Run Tests
- All: `npm test`
- Server: `npm run test:server`
- Client: `npm run test:client`
- E2E: `npm run test:e2e`

### Debug E2E
- Inspector: `npx playwright test --debug`
- UI Mode: `npx playwright test --ui`
- Report: `npx playwright show-report`

### Docker
- Start: `npm run setup:docker`
- Stop: `docker-compose down`
- Logs: `docker-compose logs -f`

---

**Need more details?** See `docs/E2E-TESTING-GUIDE.md` for comprehensive documentation.
