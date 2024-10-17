import { Dispatch, SetStateAction } from 'react';

import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

import { deleteTodo } from '../api/todos';
import { handleError } from './handleError';

export const handleDeleteTodos = (
  idsForDelete: number[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setIdsForDelete: Dispatch<SetStateAction<number[]>>,
  setError: Dispatch<SetStateAction<Errors>>,
) => {
  Promise.allSettled(
    idsForDelete.map(id =>
      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          handleError(Errors.DELETE_TODO, setError);
        })
        .finally(() => {
          setIdsForDelete([]);
        }),
    ),
  );
};
