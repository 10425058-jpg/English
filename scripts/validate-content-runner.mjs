import path from 'node:path';
import { createServer } from 'vite';

async function main() {
  const writeReport = process.argv.includes('--write-report');
  const rootDir = process.cwd();
  const vite = await createServer({
    root: path.join(rootDir, 'frontend'),
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
    logLevel: 'silent',
  });

  try {
    const mod = await vite.ssrLoadModule(path.join(rootDir, 'scripts/validate-content.ts'));
    const code = await mod.runValidation(writeReport);
    process.exitCode = code;
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
