import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import CommentThread from './CommentThread';

describe('CommentThread', () => {
  test('shows a message when there are no events', () => {
    render(<CommentThread events={[]} />);
    expect(screen.getByText(/nenhum evento registrado/i)).toBeInTheDocument();
  });

  test('renders a comment event', () => {
    const events = [
      {
        id: 1,
        event_type: 'comment',
        author_name: 'Agente TI',
        comment_body: 'Estamos verificando.',
        is_internal: false,
        created_at: '2026-07-31T16:00:00.000Z',
      },
    ];
    render(<CommentThread events={events} />);
    expect(screen.getByText('Estamos verificando.')).toBeInTheDocument();
    expect(screen.getByText('Agente TI')).toBeInTheDocument();
  });

  // Regression test: status_change events used to interpolate the raw enum
  // value ("em_andamento") straight into the sentence.
  test('renders a status_change event with human-readable labels', () => {
    const events = [
      {
        id: 2,
        event_type: 'status_change',
        author_name: 'Agente TI',
        old_status: 'aberto',
        new_status: 'em_andamento',
        created_at: '2026-07-31T16:00:00.000Z',
      },
    ];
    render(<CommentThread events={events} />);
    expect(screen.getByText(/Aberto/)).toBeInTheDocument();
    expect(screen.getByText(/Em andamento/)).toBeInTheDocument();
    expect(screen.queryByText(/em_andamento/)).not.toBeInTheDocument();
  });
});
