import { Todo } from './Todo';
import { Filter } from './Filter';
import { Error } from './Error';

export type Action = { type: 'setTodos', payload: Todo[] }
| { type: 'setTempTodo', payload: Todo | null }
| { type: 'addTodo', payload: Todo }
| { type: 'editTodo', payload: Todo }
| { type: 'deleteTodo', payload: Todo }
| { type: 'toggleTodo', payload: Todo }
| { type: 'addLoading', payload: Todo }
| { type: 'deleteLoading', payload: Todo }
| { type: 'setInputValue', payload: string }
| { type: 'setFilter', payload: Filter }
| { type: 'setError', payload: Error | '' };
