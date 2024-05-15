import { Todo } from '../types/Todo';
import { Action, TodoContextType } from './TodoContext';

export const TodoReducer = (state: TodoContextType, action: Action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    case 'CHECK_TODO':
      return {
        ...state,
        todos: state.todos.map((todo: Todo) => {
          if (todo.id === action.payload) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo: Todo) => todo.id !== action.payload),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map((todo: Todo) => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }

          return todo;
        }),
      };
    case 'DELETE_COMPLETED_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo: Todo) => !todo.completed),
      };
    case 'CHECK_ALL_TODO':
      const allCompleted = state.todos.every((todo: Todo) => todo.completed);
      const updatedTodos = state.todos.map((todo: Todo) => ({
        ...todo,
        completed: !allCompleted,
      }));

      return {
        ...state,
        todos: updatedTodos,
      };
    default:
      return state;
  }
};
