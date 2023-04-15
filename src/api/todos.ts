import { todo } from "../types/todo";
import { client } from "../utils/fetchClients";

export const getTodos = (userId: number) => {
  return client.get<todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Omit<todo, "id">) => {
  return client.post<todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
