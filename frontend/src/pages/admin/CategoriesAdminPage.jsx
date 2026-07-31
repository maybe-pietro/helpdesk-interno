import { useForm } from 'react-hook-form';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '../../hooks/useDepartments';
import { useAllCategories, useCreateCategory, useDeleteCategory } from '../../hooks/useCategories';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

function DepartmentsSection() {
  const { data: departments } = useDepartments();
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await createDepartment.mutateAsync(data);
    toast.success('Departamento adicionado.');
    reset();
  };

  const handleDelete = async (dept) => {
    const ok = await confirm(`Remover "${dept.name}"? Isso nao pode ser desfeito.`);
    if (!ok) return;
    deleteDepartment.mutate(dept.id, { onSuccess: () => toast.success('Departamento removido.') });
  };

  return (
    <Card className="space-y-3">
      {ConfirmDialog}
      <h2 className="text-sm font-semibold text-slate-700">Departamentos</h2>
      <ul className="space-y-1">
        {departments?.map((dept) => (
          <li key={dept.id} className="flex items-center justify-between text-sm">
            <span>{dept.name}</span>
            <button
              type="button"
              className="text-xs text-slate-500 hover:underline"
              onClick={() => handleDelete(dept)}
            >
              Remover
            </button>
          </li>
        ))}
        {departments?.length === 0 && <li className="text-sm text-slate-400">Nenhum departamento cadastrado.</li>}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 pt-2 border-t border-slate-100">
        <Input placeholder="Novo departamento" className="flex-1" {...register('name', { required: true })} />
        <Button type="submit" variant="secondary" disabled={isSubmitting}>Adicionar</Button>
      </form>
    </Card>
  );
}

function CategoriesSection() {
  const { data: departments } = useDepartments();
  const { data: categories } = useAllCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    await createCategory.mutateAsync({ name: data.name, department_id: Number(data.department_id) });
    toast.success('Categoria adicionada.');
    reset();
  };

  const handleDelete = async (cat) => {
    const ok = await confirm(`Remover "${cat.name}"? Isso nao pode ser desfeito.`);
    if (!ok) return;
    deleteCategory.mutate(cat.id, { onSuccess: () => toast.success('Categoria removida.') });
  };

  return (
    <Card className="space-y-3">
      {ConfirmDialog}
      <h2 className="text-sm font-semibold text-slate-700">Categorias</h2>
      <ul className="space-y-1">
        {categories?.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between text-sm">
            <span>{cat.name} <span className="text-xs text-slate-400">({departments?.find((d) => d.id === cat.department_id)?.name})</span></span>
            <button
              type="button"
              className="text-xs text-slate-500 hover:underline"
              onClick={() => handleDelete(cat)}
            >
              Remover
            </button>
          </li>
        ))}
        {categories?.length === 0 && <li className="text-sm text-slate-400">Nenhuma categoria cadastrada.</li>}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 pt-2 border-t border-slate-100">
        <Input placeholder="Nova categoria" className="flex-1" {...register('name', { required: true })} />
        <Select className="w-auto" {...register('department_id', { required: true })}>
          <option value="">Departamento</option>
          {departments?.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </Select>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>Adicionar</Button>
      </form>
      {errors.department_id && <p className="text-red-600 text-xs">Selecione um departamento</p>}
    </Card>
  );
}

export default function CategoriesAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">Departamentos e categorias</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <DepartmentsSection />
        <CategoriesSection />
      </div>
    </div>
  );
}
