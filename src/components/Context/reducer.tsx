import { Filter } from '../../types/Filter';
import { Notification } from '../../types/Notification';
import { State } from '../../types/State';
import { Todo } from '../../types/Todo';

export type Action = { type: 'getTodos', todos: Todo[] }
| { type: 'updateTempTodo', tempTodo: Todo | null }
| { type: 'addTodo', newTodo: Todo }
| { type: 'removeTodo', iD: number }
| { type: 'showNotification', notification: Notification | null }
| { type: 'filter', filterType: Filter }
| { type: 'markCompleted', iD: number }
| { type: 'toggleCompleted', payload: boolean }
| { type: 'showLoader', payload: number[] };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'getTodos':
      return {
        ...state,
        todos: action.todos,
      };

    case 'updateTempTodo':
      return {
        ...state,
        tempTodo: action.tempTodo,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.newTodo],
      };

    case 'removeTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.iD),
      };

    case 'showNotification':
      return {
        ...state,
        notification: action.notification,
      };

    case 'filter':
      return {
        ...state,
        filterType: action.filterType,
      };

    case 'markCompleted':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.iD) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };

    case 'toggleCompleted':
      return {
        ...state,
        todos: state.todos.map(todo => (
          {
            ...todo,
            completed: action.payload,
          }
        )),
      };

    case 'showLoader':
      return {
        ...state,
        coveredTodoIds: action.payload,
      };

    default:
      return state;
  }
}
