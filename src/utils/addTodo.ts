import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';

export function addTodo(
  inputValue: string,
  setError: Dispatch<SetStateAction<string>>,
  setisLoadingId: Dispatch<SetStateAction<number | null>>,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setInputValue: Dispatch<SetStateAction<string>>,
) {
  if (inputValue.trim() === '') {
    setError('Title should not be empty');

    return;
  }

  setisLoadingId(0);

  const newTempTodo: Todo = {
    id: 0,
    userId: 1551,
    title: inputValue.trim(),
    completed: false,
  };

  setTempTodo(newTempTodo);

  const newTodo: Omit<Todo, 'id'> = {
    userId: 1551,
    title: inputValue.trim(),
    completed: false,
  };

  createTodo(newTodo)
    .then(currentNewTodo => {
      setTodos(currentToDos => [...currentToDos, currentNewTodo]);
      setInputValue('');
      setTempTodo(null);
      setError('');
      setisLoadingId(null);
    })
    .catch(error => {
      setTempTodo(null);
      setError('Unable to add a todo');
      throw error;
    })
    .finally(() => {
      setisLoadingId(0);
    });
}
