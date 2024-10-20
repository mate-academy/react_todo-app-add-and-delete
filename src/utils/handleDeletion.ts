import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { deleteTodo } from '../api/todos';
import { handleError } from './handleError';

export const handleDeletion = (
  deletionIds: number[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setDeletionIds: Dispatch<SetStateAction<number[]>>,
  setErrorMessage: Dispatch<SetStateAction<Errors>>,
) => {
  Promise.allSettled(
    deletionIds.map(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== id));
        })
        .catch(() => {
          handleError(setErrorMessage, Errors.DeleteTodo);
        })
        .finally(() => setDeletionIds([]));
    }),
  );
};
