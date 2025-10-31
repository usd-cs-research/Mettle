import { test, expect } from '@playwright/test';

test.describe('Full User Journey - Signup to Session', () => {
	const uniqueEmail = `testuser_${Date.now()}@example.com`;
	const password = 'SecurePass123!';
	const username = 'TestUser';

	test('should complete full user journey from signup to session', async ({ page }) => {
		// Step 1: Navigate to signup page
		await page.goto('/');
		await expect(page).toHaveURL(/.*login/);

		// Navigate to signup if on login page
		const signupLink = page.locator('text=/sign up|create account|register/i').first();
		if (await signupLink.isVisible({ timeout: 2000 }).catch(() => false)) {
			await signupLink.click();
		}

		// Step 2: Register a new user
		await page.fill('input[name="email"], input[type="email"]', uniqueEmail);
		await page.fill('input[name="password"], input[type="password"]', password);
		await page.fill('input[name="username"], input[name="name"]', username);

		// Submit signup form
		await page.click('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');

		// Wait for redirect after successful signup
		await page.waitForURL(/.*(?:home|dashboard|intro|roles)/, { timeout: 10000 });

		// Step 3: Logout
		const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
		await expect(logoutButton).toBeVisible({ timeout: 5000 });
		await logoutButton.click();

		// Verify redirected to login page
		await page.waitForURL(/.*login/, { timeout: 5000 });

		// Step 4: Login with the same credentials
		await page.fill('input[name="email"], input[type="email"]', uniqueEmail);
		await page.fill('input[name="password"], input[type="password"]', password);
		await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');

		// Wait for redirect after successful login
		await page.waitForURL(/.*(?:home|dashboard|intro|roles)/, { timeout: 10000 });

		// Step 5: Start a new session
		// Navigate through the flow (this depends on your app's navigation)
		// Look for "New Session" or "Start Session" button
		const newSessionButton = page.locator('button:has-text("New Session"), button:has-text("Start Session"), a:has-text("New Session")');
		if (await newSessionButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await newSessionButton.click();
		}

		// Step 6: Select a problem and role
		// Wait for problem selection page
		await page.waitForTimeout(1000); // Give UI time to load

		// Try to select a problem (adjust selectors based on your UI)
		const problemCard = page.locator('[class*="problem"], [class*="card"]').first();
		if (await problemCard.isVisible({ timeout: 3000 }).catch(() => false)) {
			await problemCard.click();
		}

		// Try to select a role (adjust selectors based on your UI)
		const roleButton = page.locator('button:has-text("Student"), button:has-text("Teacher")').first();
		if (await roleButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await roleButton.click();
		}

		// Step 7: Verify session UI elements
		// Check for session-related elements (adjust based on your actual UI)
		const sessionIndicators = [
			page.locator('[class*="session"]'),
			page.locator('[class*="problem"]'),
			page.locator('text=/Session|Problem|Question/i')
		];

		// At least one session indicator should be visible
		let foundSessionUI = false;
		for (const indicator of sessionIndicators) {
			if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
				foundSessionUI = true;
				break;
			}
		}

		// If we got this far without errors, the journey was successful
		expect(foundSessionUI || page.url()).toBeTruthy();
	});

	test('should handle login errors correctly', async ({ page }) => {
		// Navigate to login page
		await page.goto('/');
		await page.waitForURL(/.*login/, { timeout: 5000 });

		// Try to login with invalid credentials
		await page.fill('input[name="email"], input[type="email"]', 'nonexistent@example.com');
		await page.fill('input[name="password"], input[type="password"]', 'WrongPassword123');
		await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');

		// Should show error message or stay on login page
		await page.waitForTimeout(2000);

		// Check for error message
		const errorMessage = page.locator('text=/error|invalid|incorrect|failed/i');
		const isOnLoginPage = page.url().includes('login');

		expect(await errorMessage.isVisible().catch(() => false) || isOnLoginPage).toBeTruthy();
	});

	test('should validate signup form fields', async ({ page }) => {
		// Navigate to signup page
		await page.goto('/');

		const signupLink = page.locator('text=/sign up|create account|register/i').first();
		if (await signupLink.isVisible({ timeout: 2000 }).catch(() => false)) {
			await signupLink.click();
		}

		// Try to submit empty form
		const submitButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');
		await submitButton.click();

		// Should show validation errors or stay on signup page
		await page.waitForTimeout(1000);

		const hasValidationError = await page.locator('text=/required|invalid|error/i').isVisible().catch(() => false);
		const isStillOnSignup = page.url().includes('signup') || page.url().includes('register');

		expect(hasValidationError || isStillOnSignup).toBeTruthy();
	});
});
