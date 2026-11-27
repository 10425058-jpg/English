import { useState } from 'react';
import { Download, RotateCcw, Settings, Shield, Upload } from 'lucide-react';
import type { DailyGoalMinutes, EnglishAccent } from '@english-quest/shared';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { useQuestStore } from '@/stores/useQuestStore';

export function SettingsPage() {
  const displayName = useQuestStore((s) => s.displayName);
  const setDisplayName = useQuestStore((s) => s.setDisplayName);
  const preferences = useQuestStore((s) => s.preferences);
  const updatePreferences = useQuestStore((s) => s.updatePreferences);
  const exportBackupJson = useQuestStore((s) => s.exportBackupJson);
  const importBackupJson = useQuestStore((s) => s.importBackupJson);
  const buildAccountMigrationPayload = useQuestStore((s) => s.buildAccountMigrationPayload);
  const resetAllProgress = useQuestStore((s) => s.resetAllProgress);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDownloadExport = () => {
    const json = exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `english-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Exported your complete learning data backup as JSON.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    const res = importBackupJson(content);
    setStatusMessage(res.ok ? 'Imported backup successfully!' : `Import failed: ${res.error}`);
  };

  const handlePreviewMigration = () => {
    const payload = buildAccountMigrationPayload();
    setStatusMessage(
      `Account migration bundle ready: ${Object.keys(payload.lessonProgress).length} lessons, ${payload.xpTransactions.length} XP records, ${payload.mistakes.length} mistakes prepared for Phase 2 backend sync.`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <PillBadge tone="neutral">
          <Settings className="h-3.5 w-3.5" />
          Preferences, Audio & Privacy
        </PillBadge>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Settings & Data Ownership</h1>
        <p className="mt-1 text-sm font-semibold text-[#666666]">
          Customize study goals, accessibility, voice accent, and export or delete your local progress anytime.
        </p>
      </div>

      {statusMessage && (
        <div role="status" className="rounded-2xl border-2 border-[#B8EE8A] bg-[#E9FCD9] p-3.5 text-sm font-black text-[#2B6400]">
          {statusMessage}
        </div>
      )}

      {/* Study & Audio Preferences */}
      <QuestCard className="space-y-4">
        <h2 className="text-lg font-black">Study & Speech Preferences</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="set-name" className="block text-xs font-black uppercase text-[#777777] mb-1">
              Display Name
            </label>
            <input
              id="set-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
            />
          </div>

          <div>
            <label htmlFor="set-goal" className="block text-xs font-black uppercase text-[#777777] mb-1">
              Daily Study Goal
            </label>
            <select
              id="set-goal"
              value={preferences.dailyGoalMinutes}
              onChange={(e) =>
                updatePreferences({ dailyGoalMinutes: Number(e.target.value) as DailyGoalMinutes })
              }
              className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
            >
              {[5, 15, 30, 60, 90].map((m) => (
                <option key={m} value={m}>
                  {m} minutes / day
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="set-accent" className="block text-xs font-black uppercase text-[#777777] mb-1">
              Preferred English Voice
            </label>
            <select
              id="set-accent"
              value={preferences.preferredAccent}
              onChange={(e) =>
                updatePreferences({ preferredAccent: e.target.value as EnglishAccent })
              }
              className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
            >
              <option value="en-US">American English (en-US)</option>
              <option value="en-GB">British English (en-GB)</option>
            </select>
          </div>

          <div>
            <label htmlFor="set-rate" className="block text-xs font-black uppercase text-[#777777] mb-1">
              Speech Playback Speed ({preferences.speechRate.toFixed(2)}x)
            </label>
            <input
              id="set-rate"
              type="range"
              min={0.7}
              max={1.3}
              step={0.05}
              value={preferences.speechRate}
              onChange={(e) => updatePreferences({ speechRate: Number(e.target.value) })}
              className="w-full accent-[#58CC02]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {[
            {
              key: 'bilingualExplanations' as const,
              title: 'Bilingual English–Vietnamese Explanations',
              desc: 'Show Vietnamese hints and grammar translations alongside English.',
            },
            {
              key: 'soundEffects' as const,
              title: 'Playful Sound Effects',
              desc: 'Subtle synthesized chimes on correct answers and treasure chests.',
            },
            {
              key: 'reducedMotion' as const,
              title: 'Reduced Motion Mode',
              desc: 'Minimize decorative animations for comfort and accessibility.',
            },
            {
              key: 'heartsEnabled' as const,
              title: 'Optional Hearts Indicator',
              desc: 'Display decorative hearts during lessons (never blocks practice).',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-3 rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={preferences[item.key]}
                onChange={(e) => updatePreferences({ [item.key]: e.target.checked })}
                className="mt-1 h-4 w-4 accent-[#58CC02]"
              />
              <div>
                <p className="text-sm font-black">{item.title}</p>
                <p className="text-xs font-semibold text-[#666666]">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </QuestCard>

      {/* Privacy & Audio Retention */}
      <QuestCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#1CB0F6]" />
          <h2 className="text-lg font-black">Privacy, Audio Consent & Cloud Sync</h2>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.audioConsentGranted}
            onChange={(e) => updatePreferences({ audioConsentGranted: e.target.checked })}
            className="mt-1 h-4 w-4 accent-[#1CB0F6]"
          />
          <div>
            <p className="text-sm font-black">Microphone Recording Consent</p>
            <p className="text-xs font-semibold text-[#666666]">
              Recordings stay solely inside your browser session memory during Phase 1.
            </p>
          </div>
        </label>

        <HonestNotice
          title="Guest-to-Account Migration Strategy (Phase 2)"
          description="Your progress is stored locally right now. When Phase 2 NestJS + PostgreSQL authentication is connected, your local GuestMigrationPayload uploads idempotently so zero XP, streaks, or vocabulary schedules are lost."
        />

        <div className="flex flex-wrap gap-3">
          <TactileButton variant="secondary" size="sm" onClick={handleDownloadExport}>
            <Download className="h-4 w-4" />
            Export Data (JSON)
          </TactileButton>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white px-4 py-2 text-sm font-extrabold hover:bg-[#F7F8FA]">
            <Upload className="h-4 w-4" />
            <span>Import Backup</span>
            <input type="file" accept="application/json" onChange={handleImportFile} className="sr-only" />
          </label>

          <TactileButton variant="outline" size="sm" onClick={handlePreviewMigration}>
            Inspect Phase 2 Sync Bundle
          </TactileButton>
        </div>

        <div className="border-t border-[#E5E5E5] pt-4">
          {!confirmReset ? (
            <TactileButton variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4" />
              Delete / Reset All Local Progress
            </TactileButton>
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#FFB8B8] bg-[#FFF4F4] p-3">
              <p className="text-sm font-black text-[#D32F2F]">
                Are you sure? This permanently erases local XP, lessons, and saved words.
              </p>
              <TactileButton
                variant="danger"
                size="sm"
                onClick={() => {
                  resetAllProgress();
                  setConfirmReset(false);
                  setStatusMessage('All local progress has been reset cleanly.');
                }}
              >
                Confirm Reset
              </TactileButton>
              <TactileButton variant="outline" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </TactileButton>
            </div>
          )}
        </div>
      </QuestCard>
    </div>
  );
}
