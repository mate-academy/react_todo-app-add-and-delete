import { useContext, useEffect, useState } from 'react';
import { getTodos } from '../api/todos';
import { TodoType } from '../types/Todo';
import { ErrorsContext }
  from '../providers/ErrorsProvider/ErrorsProvider';

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const errorsContext = useContext(ErrorsContext);

  if (!errorsContext) {
    throw new Error('no errorsContext');
  }

  const { addError } = errorsContext;

  useEffect(() => {
    getTodos(11524)
      .then(setTodos)
      .catch(() => addError('errorLoadingTodos'))
      .finally(() => setLoadingTodos(false));
  }, []);

  return { todos, loadingTodos };
};
