import React from 'react';
import { deleteTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/userId';

type ClearCompletedButtonProps = {
  allTodosIncompleted: boolean,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showErrorNotification: (error: string) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
};

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  allTodosIncompleted,
  todos,
  setTodos,
  showErrorNotification,
  setLoading,
  setLoadingActiveTodoId,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteCompleteTodos = async (userId: number) => {
    try {
      setLoading(true);
      const completedTodosId = completedTodos.map(todo => todo.id);

      setLoadingActiveTodoId(completedTodosId);
      const todosToDelete = completedTodos.map(todo => {
        return deleteTodos(userId, todo.id);
      });

      await Promise.all(todosToDelete);
      const newTodos = todos.filter(todo => !todo.completed);

      setTodos(newTodos);
    } catch {
      showErrorNotification('Unable to delete complete todos');
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
    }
  };

  return (
    <>
      {!allTodosIncompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeleteCompleteTodos(USER_ID)}
        >
          Clear completed
        </button>
      )}
    </>
  );
};
