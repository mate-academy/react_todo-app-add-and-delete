import { ErrorType } from '../types/ErrorType';
import { Filter } from '../types/Filter';
import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
export const prepareTodo = (todoStatus: Filter, todos: Todo[]) => {
  switch (todoStatus) {
    case Filter.ALL:
      return todos;
    case Filter.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filter.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      throw new Error('Invalid todo status');
  }
};

export const loadTodosFromServer = async (
  userId: number,
  setTodos: (todos: Todo[]) => void,
  setErrorType: (errorType: ErrorType) => void,
) => {
  try {
    const todosFromServer = await getTodos(userId);

    setTodos(todosFromServer);
  } catch (error) {
    setErrorType(ErrorType.LOAD);
  }
};
