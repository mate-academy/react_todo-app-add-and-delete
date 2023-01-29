import { useState, useCallback } from 'react';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showError: ((message: string) => void),
};

type HookOutput = [
  boolean,
  Todo | null,
  (todoInfo: Omit<Todo, 'id'>) => void,
];

export const useAddingTodo = (props: Props): HookOutput => {
  const {
    setTodos,
    showError,
  } = props;

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [temporaryNewTodo, setTemporaryNewTodo] = useState<Todo | null>(null);

  const addTodo = useCallback((todoInfo: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);

    const temporaryTodo = {
      ...todoInfo,
      id: 0,
    };

    setTemporaryNewTodo(temporaryTodo);

    createTodo(todoInfo)
      .then((newTodo) => setTodos((prevTodos) => ([...prevTodos, newTodo])))
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setTemporaryNewTodo(null);
        setIsAddingTodo(false);
      });
  }, []);

  return [isAddingTodo, temporaryNewTodo, addTodo];
};
