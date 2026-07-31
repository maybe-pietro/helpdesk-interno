export default function Label({ className = '', ...props }) {
  return <label className={`block text-sm text-slate-600 mb-1 ${className}`} {...props} />;
}
