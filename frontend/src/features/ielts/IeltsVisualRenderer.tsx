import type { IELTSVisualSpec } from '@english-quest/shared';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHART_PALETTE = ['#1CB0F6', '#58CC02', '#CE82FF', '#FF9600', '#FF4B4B'];

interface Props {
  visual: IELTSVisualSpec;
}

export function IeltsVisualRenderer({ visual }: Props) {
  if (visual.type === 'table' && visual.tableRows?.length) {
    const [header, ...body] = visual.tableRows;
    return (
      <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-black text-[#3C3C3C]">{visual.title}</p>
          <span className="rounded-lg bg-[#F7F8FA] px-2.5 py-1 text-xs font-extrabold text-[#666666] border border-[#E5E5E5]">
            Unit: {visual.unitLabel}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[#E5E5E5] bg-[#F7F8FA]">
                {header.map((col) => (
                  <th key={col} className="px-3 py-2 font-black text-[#3C3C3C]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, idx) => (
                <tr key={idx} className="border-b border-[#EFEFEF] last:border-b-0">
                  {row.map((cell, cIdx) => (
                    <td
                      key={`${idx}-${cIdx}`}
                      className={`px-3 py-2 ${cIdx === 0 ? 'font-black text-[#3C3C3C]' : 'font-semibold text-[#555555]'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (visual.type === 'process' && visual.processSteps?.length) {
    return (
      <div className="rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4 space-y-3">
        <p className="text-sm font-black text-[#0C5E8A]">{visual.title}</p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {visual.processSteps.map((step, idx) => (
            <div
              key={step}
              className="rounded-xl border border-[#BCE7FD] bg-white p-3 flex items-start gap-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1CB0F6] text-xs font-black text-white">
                {idx + 1}
              </span>
              <p className="text-xs font-extrabold text-[#3C3C3C] leading-snug">{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.type === 'map' && visual.mapChanges?.length) {
    return (
      <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-3">
        <p className="text-sm font-black text-[#3C3C3C]">{visual.title}</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {visual.mapChanges.map((item) => (
            <div key={item.zone} className="rounded-xl border border-[#E5E5E5] bg-white p-3 space-y-1.5">
              <p className="text-xs font-black uppercase tracking-wide text-[#8E3FD6]">{item.zone}</p>
              <p className="text-xs font-bold text-[#777777]">
                Before: <span className="text-[#3C3C3C]">{item.before}</span>
              </p>
              <p className="text-xs font-bold text-[#46A302]">
                After: <span className="text-[#3C3C3C]">{item.after}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.type === 'pie' && visual.categories?.length && visual.series?.[0]?.values?.length) {
    const pieData = visual.categories.map((cat, idx) => ({
      name: cat,
      value: visual.series?.[0]?.values[idx] ?? 0,
    }));
    return (
      <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-2" data-testid="ielts-task1-chart">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-black text-[#3C3C3C]">{visual.title}</p>
          <span className="text-xs font-extrabold text-[#666666]">Unit: {visual.unitLabel}</span>
        </div>
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height={240} minWidth={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={78}
                label={({ name, value }) => `${name}: ${value}${visual.unitLabel}`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={entry.name} fill={CHART_PALETTE[idx % CHART_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Bar & Line chart data transform
  const categories = visual.categories ?? [];
  const series = visual.series ?? [];
  const chartData = categories.map((cat, idx) => {
    const row: Record<string, string | number> = { category: cat };
    for (const s of series) {
      row[s.name] = s.values[idx] ?? 0;
    }
    return row;
  });

  return (
    <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-2" data-testid="ielts-task1-chart">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black text-[#3C3C3C]">{visual.title}</p>
        <span className="text-xs font-extrabold text-[#666666]">Unit: {visual.unitLabel}</span>
      </div>
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height={240} minWidth={220}>
          {visual.type === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {series.map((s, idx) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={CHART_PALETTE[idx % CHART_PALETTE.length]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {series.map((s, idx) => (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  fill={CHART_PALETTE[idx % CHART_PALETTE.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
