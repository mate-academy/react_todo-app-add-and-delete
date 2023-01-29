import { useCallback } from 'react';
import { deleteTodoById } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showError: ((message: string) => void),
  completedTodos: Todo[],
};

type HookOutput = [
  (todoId: number) => void,
  () => void,
];

export const useDeletingTodos = (props: Props): HookOutput => {
  const {
    setLoadingTodosIds,
    setTodos,
    showError,
    completedTodos,
  } = props;

  const deleteTodo = useCallback((todoId: number) => {
    setLoadingTodosIds((prevIds) => ([...prevIds, todoId]));

    deleteTodoById(todoId)
      .then(() => setTodos((prevTodos) => (prevTodos.filter(
        todo => todo.id !== todoId,
      ))))
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodosIds((prevIds) => (prevIds.filter(
          todoIdToDelete => todoIdToDelete !== todoId,
        )));
      });
  }, []);

  const removeCompleted = () => (
    completedTodos.forEach(todo => deleteTodo(todo.id))
  );

  return [deleteTodo, removeCompleted];
};
