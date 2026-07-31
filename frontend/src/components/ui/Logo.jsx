export default function Logo({ className = '', showWordmark = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        className="w-7 h-7 text-brand-600 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.5A2.5 2.5 0 015.5 6h13A2.5 2.5 0 0121 8.5V10a2 2 0 000 4v1.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 15.5V14a2 2 0 000-4V8.5z"
        />
        <path strokeLinecap="round" d="M9.5 6.5v11" strokeDasharray="2 2" />
      </svg>
      {showWordmark && <span className="font-semibold text-slate-800 tracking-tight">Helpdesk</span>}
    </span>
  );
}
