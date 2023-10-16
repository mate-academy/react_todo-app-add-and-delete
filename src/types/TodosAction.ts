import { Todo } from './Todo';

export type TodosAction = { type: 'initialize', payload: Todo[] }
| { type: 'create', payload: Todo }
| { type: 'delete', payload: number }
| { type: 'toggle completed status', payload: number }
| { type: 'clear all completed', payload: number[] };
