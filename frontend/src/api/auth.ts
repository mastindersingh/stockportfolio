import { apiClient } from './client';
import type { LoginPayload, LoginResponse, UserSession } from '../types';

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
  return { ...data, authenticated: true };
};

export const logoutRequest = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getSession = async (): Promise<UserSession> => {
  const { data } = await apiClient.get<UserSession>('/auth/session');
  return data;
};

export const registerRequest = async (payload: LoginPayload): Promise<void> => {
  await apiClient.post('/auth/register', payload);
};

export const updateSubscription = async (subscriptionCode: string): Promise<void> => {
  await apiClient.post('/auth/subscription', { subscriptionCode });
};
