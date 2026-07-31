import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import PriorityBadge, { PRIORITY_LABELS } from './PriorityBadge';

describe('PriorityBadge', () => {
  test.each(Object.keys(PRIORITY_LABELS))('renders a human-readable label for "%s"', (priority) => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(PRIORITY_LABELS[priority])).toBeInTheDocument();
  });
});
