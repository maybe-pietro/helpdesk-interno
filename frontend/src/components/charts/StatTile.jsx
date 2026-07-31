import Card from '../ui/Card';

export default function StatTile({ label, value }) {
  return (
    <Card padding="p-4">
      <p className="text-xs text-[#898781]">{label}</p>
      <p className="text-2xl font-semibold text-[#0b0b0b] mt-1">{value}</p>
    </Card>
  );
}
