import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboardApi';

export function useDashboardSummary() {
  return useQuery({ queryKey: ['dashboard', 'summary'], queryFn: dashboardApi.fetchSummary });
}

export function useDashboardByCategory() {
  return useQuery({ queryKey: ['dashboard', 'by-category'], queryFn: dashboardApi.fetchByCategory });
}

export function useDashboardByDepartment() {
  return useQuery({ queryKey: ['dashboard', 'by-department'], queryFn: dashboardApi.fetchByDepartment });
}

export function useDashboardAvgResolutionTime() {
  return useQuery({ queryKey: ['dashboard', 'avg-resolution-time'], queryFn: dashboardApi.fetchAvgResolutionTime });
}
