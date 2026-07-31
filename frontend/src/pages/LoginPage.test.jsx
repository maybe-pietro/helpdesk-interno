import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows validation errors when submitting empty fields', async () => {
    useAuth.mockReturnValue({ login: vi.fn() });
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/email obrigatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/senha obrigatoria/i)).toBeInTheDocument();
  });

  test('calls login with the entered credentials', async () => {
    const login = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'admin@empresa.com');
    await user.type(screen.getByLabelText(/senha/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('admin@empresa.com', 'admin123');
    });
  });

  test('shows a server error message when login fails', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    useAuth.mockReturnValue({ login });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'admin@empresa.com');
    await user.type(screen.getByLabelText(/senha/i), 'senha-errada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/email ou senha invalidos/i)).toBeInTheDocument();
  });
});
