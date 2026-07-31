import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ticketsApi from '../api/ticketsApi';

export function useTickets(filters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsApi.listTickets(filters),
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: Boolean(id),
  });
}

export function useTicketEvents(id) {
  return useQuery({
    queryKey: ['tickets', id, 'events'],
    queryFn: () => ticketsApi.listTicketEvents(id),
    enabled: Boolean(id),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useUpdateTicket(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ticketsApi.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useChangeTicketStatus(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status) => ticketsApi.changeTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'events'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAssignTicket(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId) => ticketsApi.assignTicket(id, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'events'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAddComment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, isInternal }) => ticketsApi.addTicketComment(id, body, isInternal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets', id, 'events'] }),
  });
}

export function useUploadAttachment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => ticketsApi.uploadAttachment(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets', id] }),
  });
}
