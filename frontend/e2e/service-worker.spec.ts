import { expect, test } from '@playwright/test';

test('production navigation ignores stale HTML and failed asset requests never use an HTML fallback', async ({ page, context }) => {
  await page.goto('./#/learn');
  await expect(page.getByText('Greetings & First Introductions')).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await page.evaluate(async () => {
    const cache = await caches.open('english-quest-v2');
    const navigationUrl = new URL('./', window.location.href);
    await cache.put(navigationUrl.href, new Response(
      '<html><body>STALE ENGLISH QUEST BUILD</body></html>',
      { headers: { 'Content-Type': 'text/html' } },
    ));
    localStorage.setItem('english-quest-regression-probe', 'preserved');
  });

  await page.reload();
  await expect(page.getByText('Greetings & First Introductions')).toBeVisible();
  await expect(page.getByText('STALE ENGLISH QUEST BUILD')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('english-quest-regression-probe'))).toBe('preserved');

  await context.setOffline(true);
  try {
    const result = await page.evaluate(async () => {
      try {
        const response = await fetch(new URL('assets/nonexistent-regression-test.js', window.location.href), { cache: 'no-store' });
        return { contentType: response.headers.get('content-type'), succeeded: response.ok };
      } catch {
        return null;
      }
    });
    expect(result?.contentType ?? '').not.toContain('text/html');
    expect(result?.succeeded ?? false).toBe(false);
  } finally {
    await context.setOffline(false);
  }
});
