import { Dispatch, SetStateAction } from 'react';
import { getTodos } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

export const fetchTodos = (
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  handleErrorMessage: (error: ErrorType) => void,
) => {
  getTodos()
    .then(setTodos)
    .catch(() => handleErrorMessage(ErrorType.LOAD));
};
