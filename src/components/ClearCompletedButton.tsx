import React from 'react';
import { deleteCompletedTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/userId';

type ClearCompletedButtonProps = {
  allTodosIncompleted: boolean,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showErrorNotification: (error: string) => void,
};

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  allTodosIncompleted, todos, setTodos, showErrorNotification,
}) => {
  const handleDeleteCompleteTodos = async (userId: number) => {
    try {
      await deleteCompletedTodos(userId);
      const newTodos = todos.filter(todo => !todo.completed);

      setTodos(newTodos);
    } catch {
      showErrorNotification('Unable to delete complete todos');
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
