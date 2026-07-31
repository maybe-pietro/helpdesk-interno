import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as departmentsApi from '../api/departmentsApi';

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: departmentsApi.listDepartments });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => departmentsApi.updateDepartment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}
