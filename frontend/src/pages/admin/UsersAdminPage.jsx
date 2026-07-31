import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUsers, useCreateUser, useUpdateUser } from '../../hooks/useUsers';
import { useDepartments } from '../../hooks/useDepartments';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Label from '../../components/ui/Label';
import EmptyState from '../../components/ui/EmptyState';
import { LoadingBlock } from '../../components/ui/Spinner';

const ROLES = ['solicitante', 'agente', 'admin'];

export default function UsersAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: users, isLoading } = useUsers({});
  const { data: departments } = useDepartments();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await createUser.mutateAsync({
      ...data,
      department_id: data.department_id ? Number(data.department_id) : null,
    });
    toast.success('Usuario criado com sucesso.');
    reset();
    setShowForm(false);
  };

  const toggleActive = async (user) => {
    if (user.is_active) {
      const ok = await confirm(`Desativar "${user.name}"? A pessoa perde acesso ao sistema imediatamente.`);
      if (!ok) return;
    }
    updateUser.mutate(
      { id: user.id, data: { is_active: !user.is_active } },
      { onSuccess: () => toast.success(user.is_active ? 'Usuario desativado.' : 'Usuario reativado.') },
    );
  };

  return (
    <div className="space-y-4">
      {ConfirmDialog}

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Usuarios</h1>
        <Button type="button" variant="secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Novo usuario'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nome</Label>
              <Input error={Boolean(errors.name)} {...register('name', { required: true })} />
              {errors.name && <p className="text-red-600 text-xs mt-1">Obrigatorio</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" error={Boolean(errors.email)} {...register('email', { required: true })} />
              {errors.email && <p className="text-red-600 text-xs mt-1">Obrigatorio</p>}
            </div>
            <div>
              <Label>Senha inicial</Label>
              <Input type="password" error={Boolean(errors.password)} {...register('password', { required: true, minLength: 8 })} />
              {errors.password && <p className="text-red-600 text-xs mt-1">Minimo 8 caracteres</p>}
            </div>
            <div>
              <Label>Papel</Label>
              <Select {...register('role', { required: true })}>
                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </Select>
            </div>
            <div>
              <Label>Departamento (opcional)</Label>
              <Select {...register('department_id')}>
                <option value="">-</option>
                {departments?.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </Select>
            </div>
            <div className="col-span-2">
              <Button type="submit" disabled={isSubmitting}>Criar usuario</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <LoadingBlock />}

      {users && users.length === 0 && (
        <Card padding="p-0">
          <EmptyState title="Nenhum usuario cadastrado" description="Crie o primeiro usuario para comecar." />
        </Card>
      )}

      {users && users.length > 0 && (
        <Card padding="p-0" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Papel</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2 text-slate-600">{u.email}</td>
                  <td className="px-3 py-2 text-slate-600">{u.role}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                      {u.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" onClick={() => toggleActive(u)} className="text-slate-500 hover:underline text-xs">
                      {u.is_active ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
