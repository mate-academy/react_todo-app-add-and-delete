import { Dispatch, SetStateAction } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';

export const handleDeleteTodo = (
  ids: number[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setDeletingTodoIds: Dispatch<SetStateAction<number[]>>,
  handleErrorMessage: (error: ErrorType) => void,
) => {
  setDeletingTodoIds(ids);

  const deletePromises = ids.map(id => {
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage(ErrorType.DELETE);
      })
      .finally(() => {
        setDeletingTodoIds([]);
      });
  });

  return Promise.allSettled(deletePromises);
};
