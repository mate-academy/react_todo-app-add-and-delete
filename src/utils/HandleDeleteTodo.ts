import { deleteTodo } from '../api/todos';
import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { handleError } from './HandleError';
import { ErrorMessages } from '../types/ErrorMessages';

export const handleDeleteTodo = (
  idsForDelete: number[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setIdsForDelete: Dispatch<SetStateAction<number[]>>,
  setError: Dispatch<SetStateAction<ErrorMessages>>,
) => {
  Promise.allSettled(
    idsForDelete.map(async id => {
      await deleteTodo(id)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== id));
          setIdsForDelete(() => []);
        })
        .catch(() => {
          handleError(setError, ErrorMessages.DeleteFail);
          setIdsForDelete([]);
        });
    }),
  );
};
