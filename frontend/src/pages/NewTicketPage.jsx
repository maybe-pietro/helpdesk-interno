import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDepartments } from '../hooks/useDepartments';
import { useCategories } from '../hooks/useCategories';
import { useCreateTicket } from '../hooks/useTickets';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';

export default function NewTicketPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [departmentId, setDepartmentId] = useState('');
  const { data: departments } = useDepartments();
  const { data: categories } = useCategories(departmentId ? Number(departmentId) : undefined);
  const createTicket = useCreateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const ticket = await createTicket.mutateAsync({
      title: data.title,
      description: data.description,
      category_id: Number(data.category_id),
      priority: data.priority,
    });
    toast.success('Chamado aberto com sucesso.');
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Novo chamado</h1>

      <Card padding="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titulo</Label>
            <Input id="title" error={Boolean(errors.title)} {...register('title', { required: true })} />
            {errors.title && <p className="text-red-600 text-xs mt-1">Titulo obrigatorio</p>}
          </div>

          <div>
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              rows={4}
              error={Boolean(errors.description)}
              {...register('description', { required: true })}
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">Descricao obrigatoria</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Departamento</Label>
              <Select
                id="department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Selecione</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="category_id">Categoria</Label>
              <Select
                id="category_id"
                disabled={!departmentId}
                error={Boolean(errors.category_id)}
                {...register('category_id', { required: true })}
              >
                <option value="">Selecione</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
              {errors.category_id && <p className="text-red-600 text-xs mt-1">Categoria obrigatoria</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select id="priority" defaultValue="media" {...register('priority')}>
              <option value="baixa">Baixa</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Abrir chamado'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
