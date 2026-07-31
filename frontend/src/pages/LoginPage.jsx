import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError('Email ou senha invalidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo className="text-lg" />
        </div>

        <Card padding="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Entrar</h1>
              <p className="text-sm text-slate-500 mt-0.5">Acesse com seu email corporativo</p>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                {...register('email', { required: true })}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">Email obrigatorio</p>}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                {...register('password', { required: true })}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">Senha obrigatoria</p>}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v3a1 1 0 11-2 0V9zm1-5a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 4z" clipRule="evenodd" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400">Sistema interno de requisicao de chamados</p>
      </div>
    </div>
  );
}
