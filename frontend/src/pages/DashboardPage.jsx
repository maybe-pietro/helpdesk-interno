import {
  useDashboardSummary,
  useDashboardByCategory,
  useDashboardByDepartment,
  useDashboardAvgResolutionTime,
} from '../hooks/useDashboard';
import { STATUS_LABELS } from '../components/tickets/StatusBadge';
import BarList from '../components/charts/BarList';
import StatTile from '../components/charts/StatTile';
import Card from '../components/ui/Card';
import { LoadingBlock } from '../components/ui/Spinner';

// Fixed-order categorical palette (light mode) — see dataviz skill reference palette.
const CATEGORICAL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

const STATUS_ORDER = ['aberto', 'em_andamento', 'aguardando_solicitante', 'resolvido', 'fechado'];

function foldIntoOther(items, max = 7) {
  if (items.length <= max) return items;
  const head = items.slice(0, max);
  const rest = items.slice(max);
  const otherTotal = rest.reduce((sum, item) => sum + item.count, 0);
  return [...head, { ...rest[0], category: 'Outras', department: 'Outras', count: otherTotal }];
}

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useDashboardSummary();
  const { data: byCategory, isLoading: loadingCategory } = useDashboardByCategory();
  const { data: byDepartment, isLoading: loadingDepartment } = useDashboardByDepartment();
  const { data: avgResolution } = useDashboardAvgResolutionTime();

  if (loadingSummary || loadingCategory || loadingDepartment) {
    return <LoadingBlock label="Carregando dashboard..." />;
  }

  const statusItems = STATUS_ORDER
    .map((status, i) => ({ label: STATUS_LABELS[status], value: summary?.byStatus?.[status] || 0, color: CATEGORICAL[i] }))
    .filter((item) => item.value > 0);

  const categoryItems = foldIntoOther(byCategory || []).map((item, i) => ({
    label: item.category,
    value: item.count,
    color: CATEGORICAL[i % CATEGORICAL.length],
  }));

  const departmentItems = (byDepartment || []).map((item, i) => ({
    label: item.department,
    value: item.count,
    color: CATEGORICAL[i % CATEGORICAL.length],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total de chamados" value={summary?.total ?? 0} />
        <StatTile label="Em aberto" value={summary?.open ?? 0} />
        <StatTile label="Fechados" value={summary?.closed ?? 0} />
        <StatTile
          label="Tempo medio de resolucao"
          value={avgResolution?.avgHours != null ? `${Math.round(avgResolution.avgHours)}h` : '-'}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card padding="p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Por status</h2>
          {statusItems.length > 0 ? <BarList items={statusItems} /> : <p className="text-sm text-slate-500">Sem dados.</p>}
        </Card>

        <Card padding="p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Por departamento</h2>
          {departmentItems.length > 0 ? <BarList items={departmentItems} /> : <p className="text-sm text-slate-500">Sem dados.</p>}
        </Card>

        <Card padding="p-4" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Por categoria</h2>
          {categoryItems.length > 0 ? <BarList items={categoryItems} /> : <p className="text-sm text-slate-500">Sem dados.</p>}
        </Card>
      </div>
    </div>
  );
}
