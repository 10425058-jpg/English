import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const SCREENSHOT_DIR = path.resolve(process.cwd(), '../docs/screenshots');

const ALL_ROUTES = [
  '/learn',
  '/listening',
  '/speaking',
  '/reading',
  '/writing',
  '/ai-tutor',
  '/vocabulary',
  '/grammar',
  '/ielts',
  '/review',
  '/quests',
  '/leaderboard',
  '/achievements',
  '/profile',
  '/settings',
];

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

test('desktop routes render cleanly, complete an interactive lesson, and persist XP after reload', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./#/learn');
  await expect(page.getByText('Greetings & First Introductions')).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-learn.png'), fullPage: false });

  // Launch Lesson 1 and complete all 4 exercises
  await page.getByRole('button', { name: /Warm Hellos & Names/i }).click();
  await expect(page).toHaveURL(/#\/lesson\/a1-u1-l1/);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-lesson.png'), fullPage: false });

  // Q1: Multiple choice
  await page.getByRole('button', { name: /Good morning!/i }).click();
  await page.getByRole('button', { name: /Check Answer/i }).click();
  await expect(page.getByText(/Great job!/i)).toBeVisible();
  await page.getByRole('button', { name: /Continue/i }).click();

  // Q2: Fill blank
  await page.getByRole('button', { name: /is \/ am/i }).click();
  await page.getByRole('button', { name: /Check Answer/i }).click();
  await expect(page.getByText(/Great job!/i)).toBeVisible();
  await page.getByRole('button', { name: /Continue/i }).click();

  // Q3: Sentence reconstruction word bank
  for (const word of ['Nice', 'to', 'meet', 'you', 'today']) {
    await page.getByRole('button', { name: word, exact: true }).click();
  }
  await page.getByRole('button', { name: /Check Answer/i }).click();
  await expect(page.getByText(/Great job!/i)).toBeVisible();
  await page.getByRole('button', { name: /Continue/i }).click();

  // Q4: Translation
  await page.getByPlaceholder(/Type your English answer/i).fill('Hello, my name is Minh.');
  await page.getByRole('button', { name: /Check Answer/i }).click();
  await expect(page.getByText(/Great job!/i)).toBeVisible();
  await page.getByRole('button', { name: /Continue/i }).click();

  // Completion Summary
  await expect(page.getByText(/Lesson Complete!/i)).toBeVisible();
  await expect(page.getByText('+25')).toBeVisible();
  await page.getByRole('button', { name: /Continue Learning Path/i }).click();

  // Refresh page and verify local persistence of XP in desktop status rail
  await page.reload();
  await expect(
    page.getByLabel('Learner status and daily quests').getByText('25', { exact: true })
  ).toBeVisible();

  // Visit AI Tutor and send a message
  await page.goto('./#/ai-tutor');
  await page.getByRole('button', { name: /Try Sample Prompt/i }).click();
  await expect(page.getByText(/Pip Coach/i).first()).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ai-tutor.png'), fullPage: false });

  // Visit Review Dashboard & capture screenshot
  await page.goto('./#/review');
  await expect(page.getByText(/Skill Proficiency Radar/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-review.png'), fullPage: false });

  // Smoke-check every single navigation route has zero overflow and renders heading
  for (const route of ALL_ROUTES) {
    await page.goto(`./#${route}`);
    await expect(page.locator('h1').first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(overflow, `Horizontal overflow detected on desktop ${route}`).toBe(false);
  }

  // Also check Onboarding page
  await page.goto('./#/onboarding');
  await expect(page.getByText(/Welcome to English Quest/i)).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test('mobile viewport renders cleanly with zero horizontal overflow across key routes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('./#/learn');
  await expect(page.getByText('Greetings & First Introductions')).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-learn.png'), fullPage: false });

  await page.goto('./#/vocabulary');
  await expect(page.getByText(/SM-2 Flashcard Session/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-vocabulary.png'), fullPage: false });

  for (const route of ['/learn', '/listening', '/speaking', '/reading', '/writing', '/vocabulary', '/ielts', '/review', '/settings']) {
    await page.goto(`./#${route}`);
    await expect(page.locator('h1').first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(overflow, `Horizontal overflow detected on mobile ${route}`).toBe(false);
  }
});
