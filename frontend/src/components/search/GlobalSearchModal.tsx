import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, X } from 'lucide-react';
import type { CEFRLevel } from '@english-quest/shared';
import { CEFR_LEVELS } from '@content/index';
import { PillBadge } from '@/components/ui/QuestUI';
import {
  getSearchManifestSummary,
  pushSearchHistory,
  readSearchHistory,
  searchKnowledge,
  type KnowledgeSearchCategory,
  type KnowledgeSearchResult,
} from '@/services/knowledgeSearch';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: Array<{ id: KnowledgeSearchCategory; label: string }> = [
  { id: 'all', label: 'All Knowledge' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'collection', label: 'Collections' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'listening', label: 'Listening' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'reading', label: 'Reading' },
  { id: 'writing', label: 'Writing' },
  { id: 'pronunciation', label: 'Pronunciation' },
  { id: 'ielts', label: 'IELTS' },
];

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<KnowledgeSearchCategory>('all');
  const [cefrLevel, setCefrLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [results, setResults] = useState<KnowledgeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(() => readSearchHistory());
  const [totalIndexed, setTotalIndexed] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    void getSearchManifestSummary().then((m) => {
      if (!active) return;
      setTotalIndexed(m.totalEntries);
      setHistory(readSearchHistory());
    });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      void searchKnowledge(query, { category, cefrLevel, limit: 25 }).then((hits) => {
        if (!active) return;
        setResults(hits);
        setLoading(false);
      });
    }, 90);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [open, query, category, cefrLevel]);

  if (!open) return null;

  const handleSelectResult = (hit: KnowledgeSearchResult) => {
    setHistory(pushSearchHistory(query));
    onClose();
    navigate(hit.entry.route);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 pt-12 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label="Global Knowledge Search"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#E5E5E5] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-[#EFEFEF] px-4 py-3">
          <Search className="h-5 w-5 text-[#1CB0F6] shrink-0" />
          <input
            autoFocus
            type="text"
            aria-label="Search English or Vietnamese vocabulary, grammar, IELTS, or lessons"
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              if (!next.trim()) {
                setResults([]);
                setLoading(false);
              }
            }}
            placeholder="Search English words, Vietnamese meaning (with/without dấu), grammar, or IELTS..."
            className="flex-1 bg-transparent text-sm sm:text-base font-bold text-[#3C3C3C] placeholder:text-[#999999] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close global search"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5E5E5] text-[#555555] hover:bg-[#F7F8FA]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#EFEFEF] bg-[#FAFAFA] px-4 py-2.5 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-black ${
                  category === c.id
                    ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                    : 'border-[#E5E5E5] bg-white text-[#666666]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCefrLevel(lvl)}
                  className={`rounded-lg border px-2 py-0.5 text-[11px] font-black ${
                    cefrLevel === lvl
                      ? 'border-[#58CC02] bg-[#EEFFDF] text-[#357D00]'
                      : 'border-[#E5E5E5] bg-white text-[#666666]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            {totalIndexed !== null && (
              <span className="text-[11px] font-bold text-[#777777]">
                {totalIndexed.toLocaleString()} indexed items across lazy shards
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {!query.trim() ? (
            <div className="space-y-3">
              {history.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase text-[#777777]">
                    <History className="h-3.5 w-3.5" />
                    Recent Searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3 py-1 text-xs font-bold text-[#3C3C3C] hover:border-[#1CB0F6]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-5 text-center space-y-1">
                <p className="text-sm font-black text-[#4B4B4B]">
                  Bilingual Sharded Knowledge Lookup
                </p>
                <p className="text-xs font-semibold text-[#666666]">
                  Try typing an English word (&ldquo;ubiquitous&rdquo;), an inflected form (&ldquo;analyzing&rdquo;), a Vietnamese meaning (&ldquo;khách sạn&rdquo; or &ldquo;khach san&rdquo;), or an IELTS module (&ldquo;Academic Mock&rdquo;).
                </p>
              </div>
            </div>
          ) : loading ? (
            <p className="py-6 text-center text-sm font-bold text-[#666666]">
              Loading search shard & matching entries...
            </p>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-sm font-bold text-[#666666]">
              No matching entries for &ldquo;{query}&rdquo;. Try removing filters or checking spelling.
            </p>
          ) : (
            results.map((hit) => (
              <button
                key={`${hit.entry.kind}-${hit.entry.id}`}
                type="button"
                onClick={() => handleSelectResult(hit)}
                className="w-full rounded-2xl border-2 border-[#EFEFEF] bg-white p-3 text-left transition hover:border-[#84D8FF] hover:bg-[#F7FCFF] space-y-1"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-black text-[#3C3C3C]">{hit.entry.title}</span>
                    {hit.entry.cefrLevel && <PillBadge tone="green">{hit.entry.cefrLevel}</PillBadge>}
                    <PillBadge tone="blue">{hit.entry.kind.replace(/_/g, ' ')}</PillBadge>
                  </div>
                  <span className="text-[11px] font-bold text-[#888888]">{hit.matchReason}</span>
                </div>
                <p className="text-xs font-semibold text-[#555555]">{hit.entry.subtitle}</p>
                {hit.entry.vietnamese && (
                  <p className="text-xs font-bold text-[#0E8BC9]">{hit.entry.vietnamese}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
