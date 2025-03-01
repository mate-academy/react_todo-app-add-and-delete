import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';
import React from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const DoAllTodosComplete: React.FC<Props> = ({ todos, setTodos }) => {
  const allToDoCompleted = todos.every(todo => todo.completed);

  const updateComplete = async () => {
    const newStatus = !allToDoCompleted;
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: newStatus,
    }));

    try {
      await Promise.all(
        updatedTodos.map((todo: Todo) => updateTodos(todo.id || -1, todo)),
      );

      setTodos(updatedTodos);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update:', error);
    }
  };

  return (
    <button
      onClick={updateComplete}
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: allToDoCompleted,
      })}
      data-cy="ToggleAllButton"
    />
  );
};
