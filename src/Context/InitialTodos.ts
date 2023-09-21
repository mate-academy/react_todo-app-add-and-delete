import { TodosListType } from '../types/todosTypes';

const dataFromStorage = localStorage.getItem('todosList');

export const initialTodos: TodosListType = dataFromStorage
  ? JSON.parse(dataFromStorage)
  : [];
