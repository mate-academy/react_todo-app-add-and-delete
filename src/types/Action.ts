import { ErrorMessage } from './ErrorMessage';
import { FilterStatus } from './FilterStatus';
import { Todo } from './Todo';

export type Action = { type: 'loadingTodos', payload: Todo[] }
| { type: 'deleteCompletedTodos' }
| { type: 'error', payload: ErrorMessage }
| { type: 'filter', payload: FilterStatus }
| { type: 'updateTodo', payload: Todo }
| { type: 'createTempTodo', payload: Todo | null }
| { type: 'createTodo', payload: Todo }
| { type: 'deleteTodo', payload: number };
