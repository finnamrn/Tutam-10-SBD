import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await apiClient.get('/todos');
    return response.data.data;
  },

  getById: async (id: number): Promise<Todo> => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const response = await apiClient.post('/todos', payload);
    return response.data.data;
  },

  update: async (id: number, payload: UpdateTodoPayload): Promise<Todo> => {
    const response = await apiClient.patch(`/todos/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: number): Promise<Todo> => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data.data;
  },
};
