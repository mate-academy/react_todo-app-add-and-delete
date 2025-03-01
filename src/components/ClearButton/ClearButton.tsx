import React, { Dispatch } from 'react';
import { Todo } from '../../types/Todo';
import { removeTodos } from '../../api/todos';
type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleAutofocus: (isEnabled: boolean) => void;
  setErrorMesage: Dispatch<React.SetStateAction<string>>;
};

export const ClearButton: React.FC<Props> = ({
  todos,
  setTodos,
  handleAutofocus,
  setErrorMesage,
}) => {
  const isEnabled = todos.some(todo => todo.completed);

  const clearCompleted = async () => {
    handleAutofocus(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const failedIds: number[] = [];

    for (const todo of completedTodos) {
      try {
        await removeTodos(todo.id ?? -1);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to delete todo with id ${todo.id}`, error);
        failedIds.push(todo.id ?? -1);
      }
    }

    setTodos(prev =>
      prev.filter(todo => !todo.completed || failedIds.includes(todo.id ?? -1)),
    );

    if (failedIds.length > 0) {
      setErrorMesage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMesage('');
      }, 300);
    }

    handleAutofocus(false);
  };

  return (
    <button
      disabled={!isEnabled}
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  );
};
