import { TodoInterface } from "../types/todo";
import { client } from "../utils/fetchClients";

export const getTodos = (userId: number) => {
  return client.get<TodoInterface[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Omit<TodoInterface, "id">) => {
  return client.post<TodoInterface>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
