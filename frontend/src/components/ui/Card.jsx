export default function Card({ className = '', padding = 'p-6', ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-card ${padding} ${className}`}
      {...props}
    />
  );
}
