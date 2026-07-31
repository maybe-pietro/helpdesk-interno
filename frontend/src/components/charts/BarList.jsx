// Horizontal bar list: each mark carries its own label + value, so no
// separate legend is needed (identity is never color-alone here).
export default function BarList({ items }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-sm text-[#0b0b0b] truncate">{item.label}</span>
          <div className="flex-1 h-2.5 rounded-full bg-[#e1e0d9] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
          <span className="w-10 shrink-0 text-sm text-[#52514e] text-right tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
