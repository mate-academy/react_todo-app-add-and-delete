import { Filter } from '../types/Filter';
import { State } from '../types/State';
import { Todo } from '../types/Todo';

export type Action =
  { type: 'getTodos', payload: Todo[] }
  | { type: 'editTitle', id: number, newTitle: string }
  | { type: 'deleteTodo', payload: number }
  | { type: 'deleteCompletedTodo' }
  | { type: 'markStatus', payload: number }
  | { type: 'changeStatusAll', payload: boolean }
  | { type: 'addTodo', payload: Todo }
  | { type: 'errorMessage', payload: string }
  | { type: 'isLoading', payload: boolean }
  | { type: 'tempTodo', payload: Todo | null }
  | { type: 'filter', payload: Filter };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'getTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'isLoading':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'tempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'deleteCompletedTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'editTitle':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id && todo.title !== action.newTitle) {
            return {
              ...todo,
              title: action.newTitle,
              completed: false,
            };
          }

          return todo;
        }),
      };

    case 'markStatus':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };

    case 'changeStatusAll':
      return {
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: action.payload,
        })),
      };

    case 'errorMessage':
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'filter':
      return {
        ...state,
        filterBy: action.payload,
      };

    default:
      return state;
  }
}
