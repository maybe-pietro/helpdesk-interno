import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriesApi from '../api/categoriesApi';

export function useCategories(departmentId) {
  return useQuery({
    queryKey: ['categories', departmentId],
    queryFn: () => categoriesApi.listCategories(departmentId),
    enabled: departmentId !== undefined,
  });
}

export function useAllCategories() {
  return useQuery({ queryKey: ['categories', 'all'], queryFn: () => categoriesApi.listCategories() });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoriesApi.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}
