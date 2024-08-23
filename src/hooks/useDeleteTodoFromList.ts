import { Dispatch, SetStateAction, RefObject } from 'react';

import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos'; // Змініть шлях відповідно до вашої структури проекту

export const deleteTodoInTodoList = async (
  id: number,
  setTodoLoading: (id: number, loading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  inputRef: RefObject<HTMLInputElement>,
) => {
  try {
    setTodoLoading(id, true);
    setErrorMessage('');
    await deleteTodo(id);

    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  } catch (error) {
    setErrorMessage('Unable to delete a todo');
    throw error;
  } finally {
    setTodoLoading(id, false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }
};
