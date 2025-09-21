import { Todo } from './Todo';

export type DeletionSucces = void;
export type DeletionFailur = { error: true; todo: Todo };
export type DeletionResult = DeletionSucces | DeletionFailur;
