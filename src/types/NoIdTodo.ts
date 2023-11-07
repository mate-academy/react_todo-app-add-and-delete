import { Todo } from "./Todo"
export type NoIdTodo = Omit<Todo, 'id'>;