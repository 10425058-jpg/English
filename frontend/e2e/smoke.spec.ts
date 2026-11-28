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

  // Visit Review Dashboard & capture screenshot (Batch 3D Analytics, Adaptive Plan & Mistake Clustering)
  await page.goto('./#/review');
  await expect(page.getByText(/Skill Proficiency Radar/i)).toBeVisible();
  await expect(page.getByText(/Today’s Rule-Based Adaptive Study Plan/i)).toBeVisible();
  await expect(page.getByText(/IELTS Mock Readiness Progression/i)).toBeVisible();
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

  // Also verify expanded Milestone 1 lazy modules on Desktop
  await page.goto('./#/vocabulary');
  await page.getByRole('button', { name: /C1 Pack/i }).click();
  await expect(page.getByText(/ubiquitous/i)).toBeVisible();
  await page.getByRole('button', { name: /Thematic Collections \(30\)/i }).click();
  await expect(page.getByText(/Greetings, Introductions & Small Talk/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-vocabulary-collections.png'), fullPage: false });

  await page.goto('./#/grammar');
  await page.getByRole('button', { name: /C1 Academy \(8\)/i }).click();
  await expect(page.getByRole('heading', { name: /Negative & Restrictive Inversion/i })).toBeVisible();
  await page.getByRole('button', { name: /600 Interactive Drills/i }).click();
  await expect(page.getByText(/Item #1 •/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-grammar-drills.png'), fullPage: false });

  await page.goto('./#/reading');
  await expect(page.getByRole('button', { name: /Passages \(126\)/i })).toBeVisible();
  await page.getByRole('button', { name: 'C2', exact: true }).click();
  await expect(page.getByText(/Goodhart’s Law/i)).toBeVisible();
  await page.getByRole('button', { name: /Goodhart’s Law/i }).click();
  await expect(page.getByText(/One-Sentence Comprehension Summary Check/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-reading-academy.png'), fullPage: false });
  await page.getByRole('button', { name: /Curated Open Resources \(36\)/i }).click();
  await expect(page.getByText(/British Council/i).first()).toBeVisible();

  await page.goto('./#/writing');
  await expect(page.getByText(/0 \/ 97 Completed/i)).toBeVisible();
  await page.getByRole('button', { name: 'C1', exact: true }).click();
  await expect(page.getByText(/Executive Synthesis Memo/i)).toBeVisible();
  await page.getByRole('button', { name: /Executive Synthesis Memo/i }).click();
  await page.getByRole('button', { name: /Pre-Draft Drills \(3\)/i }).click();
  await expect(page.getByText(/Drill 1 of 3/i)).toBeVisible();
  await page.locator('#writing-academy-editor').fill(
    'This calibration memo analyzes how engineering teams and sales cohorts diverge smoothly under flexible hybrid schedules while preserving mentorship.'
  );
  await page.getByRole('button', { name: /Submit & Analyze Locally/i }).click();
  await expect(page.getByText(/Local Revision Feedback/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-writing-academy.png'), fullPage: false });

  await page.goto('./#/learn');
  await page.getByRole('tab', { name: /B2/i }).click();
  await expect(
    page.getByRole('heading', { name: /Counterfactual Thinking & Mixed Conditionals/i })
  ).toBeVisible();
  await page.getByRole('tab', { name: /C1/i }).click();
  await expect(
    page.getByRole('heading', { name: /Emphatic Inversion & Rhetorical Authority/i })
  ).toBeVisible();
  await page.getByRole('tab', { name: /C2/i }).click();
  await expect(
    page.getByRole('heading', { name: /Subtle Aspectual Shifts & Executive Acumen/i })
  ).toBeVisible();
  await page.getByRole('tab', { name: /Assessments & Matrix/i }).click();
  await expect(
    page.getByRole('heading', { name: /Complete A1–C2 CEFR Coverage Matrix/i })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Comprehensive CEFR Level Completion Exams/i })
  ).toBeVisible();
  await page.getByRole('tab', { name: /Integrated Loops \(24\)/i }).click();
  await expect(page.getByText(/Integrated Four-Skill Thematic Loops/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-integrated-learning.png'), fullPage: false });

  // Verify structured Unit Mastery Assessment player opens cleanly
  await page.goto('./#/assessment/unit-assess-b2-u1');
  await expect(
    page.getByRole('heading', { name: /B2 Unit 1 Mastery/i })
  ).toBeVisible();
  await expect(page.getByText(/Internal Practice Assessment/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Check Answer/i })).toBeVisible();

  // Verify Milestone 2 Listening Academy & Speaking/Pronunciation/Shadowing Academies
  await page.goto('./#/listening');
  await expect(page.getByText(/126 Lessons \(A1–C2\)/i)).toBeVisible();
  await page.getByRole('button', { name: 'C1', exact: true }).click();
  await expect(page.getByText(/Working Memory Load & Chunking/i)).toBeVisible();
  await page.getByRole('button', { name: /Working Memory Load & Chunking/i }).click();
  await page.getByRole('button', { name: /Reveal Transcript/i }).click();
  await expect(page.getByText(/Line-by-Line Transcript/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-listening-academy.png'), fullPage: false });

  await page.goto('./#/speaking');
  await expect(page.getByText(/Speaking Academy \(127\)/i)).toBeVisible();
  await page.getByRole('button', { name: /Open Fluency Guides \(6\)/i }).click();
  await expect(page.getByText(/PREP Method/i)).toBeVisible();
  await page.getByRole('tab', { name: /Conversations \(60\)/i }).click();
  await expect(page.getByText(/Register-Aware Branching Dialogue Simulator/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-conversations.png'), fullPage: false });
  await page.getByRole('tab', { name: /Think in English \(30\)/i }).click();
  await expect(page.getByText(/Anti-Translation Mental Speed Training/i)).toBeVisible();
  await page.getByRole('tab', { name: /Pronunciation Academy \(48\)/i }).click();
  await expect(page.getByText(/Vietnamese Learner Breakthrough/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-pronunciation-academy.png'), fullPage: false });
  await page.getByRole('tab', { name: /Shadowing Studio \(60\)/i }).click();
  await expect(page.getByText(/Shadowing Self-Check/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-shadowing-studio.png'), fullPage: false });

  // Verify Batch 3B + Batch 4A IELTS Mastery Center tabs, Full 40Q vs Mini-Mocks, and Global Knowledge Search
  await page.goto('./#/ielts');
  await expect(page.getByText(/IELTS Mastery Center/i)).toBeVisible();
  await page.getByRole('tab', { name: /Listening \(80\)/i }).click();
  await expect(page.getByText(/IELTS Listening Distractor Lab/i)).toBeVisible();
  await page.getByRole('tab', { name: /Reading \(60\)/i }).click();
  await expect(page.getByText(/IELTS Reading Academy/i)).toBeVisible();
  await page.getByRole('tab', { name: /Writing \(60\)/i }).click();
  await expect(page.getByText(/IELTS Writing Task 1 & Task 2 Studio/i)).toBeVisible();
  await expect(page.locator('[data-testid="ielts-task1-chart"]').first()).toBeVisible();
  await page.getByRole('tab', { name: /Strategy \(60\)/i }).click();
  await expect(page.getByText(/IELTS Strategy & Methodology Academy/i)).toBeVisible();
  await page.getByRole('tab', { name: /Mock Exams \(14\)/i }).click();
  await expect(page.getByText(/Full-Length Examinations \(40 Listening \+ 40 Reading/i)).toBeVisible();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ielts-mastery.png'), fullPage: false });

  // Verify Full 40/40 Mock Simulator renders 40L + 40R and unassessed productive defaults
  await page.goto('./#/mock-exam/ielts-mock-full-ac-01');
  await expect(page.getByRole('heading', { name: /Full Academic Mock Exam 1/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /1\. Listening \(40Q\)/i })).toBeVisible();
  await page.getByRole('button', { name: /2\. Reading \(40Q Split Screen\)/i }).click();
  await expect(page.getByText(/Academic Passage 1/i).first()).toBeVisible();
  await page.getByRole('button', { name: /4\. Speaking Simulation/i }).click();
  await expect(page.locator('#mock-spk-mode')).toHaveValue('unassessed');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ielts-mock-simulator.png'), fullPage: false });

  // Verify Global Knowledge Search modal (Ctrl+K) works across English and Vietnamese without diacritics
  await page.goto('./#/learn');
  await page.getByRole('button', { name: /Open global knowledge search/i }).first().click();
  const searchBox = page.getByLabel(/Search English or Vietnamese/i);
  await searchBox.fill('ubiquitous');
  await expect(page.getByText(/Exact headword match/i).first()).toBeVisible();
  await searchBox.fill('khach san');
  await expect(page.getByText(/hotel/i).first()).toBeVisible();
  await page.getByRole('button', { name: /Close global search/i }).click();

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
