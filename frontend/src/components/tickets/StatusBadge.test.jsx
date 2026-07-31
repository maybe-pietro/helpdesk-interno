import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import StatusBadge, { STATUS_LABELS } from './StatusBadge';

describe('StatusBadge', () => {
  // Regression test: statuses used to be shown raw (e.g. "em_andamento")
  // instead of the human-readable label, in several places across the app.
  test.each(Object.keys(STATUS_LABELS))('renders a human-readable label for "%s"', (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(STATUS_LABELS[status])).toBeInTheDocument();
    expect(screen.queryByText(status)).not.toBeInTheDocument();
  });

  test('falls back to the raw value for an unknown status', () => {
    render(<StatusBadge status="algo_desconhecido" />);
    expect(screen.getByText('algo_desconhecido')).toBeInTheDocument();
  });
});
