import { apiClient } from './client';
import type { BlogPost, ContactPayload, Lesson } from '../types';

export const fetchLessons = async (): Promise<Lesson[]> => {
  const { data } = await apiClient.get<{ lessons: Lesson[] }>('/lessons');
  return data.lessons;
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data } = await apiClient.get<{ posts: BlogPost[] }>('/blog');
  return data.posts;
};

export const submitContact = async (payload: ContactPayload): Promise<void> => {
  await apiClient.post('/contact', payload);
};
