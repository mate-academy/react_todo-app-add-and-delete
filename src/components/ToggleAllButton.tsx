import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../providers/TodosProvider';

type Props = {};

export const ToggleAllButton: React.FC<Props> = () => {
  const { todos } = useContext(TodosContext);

  const isAllCompleted = todos.every((todo) => todo.completed);

  return (
    // need to update all todos completed status onClick
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isAllCompleted,
      })}
      data-cy="ToggleAllButton"
      aria-label="Toggle all todos"
    />
  );
};
