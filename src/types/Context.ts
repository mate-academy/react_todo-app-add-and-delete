import { Todo } from './Todo';

export interface Context {
  addTodo: (todo: Todo) => void,
  removeTodo: (id: number) => void,
  changeTodo: (id: number, todo: boolean) => void,
}
