import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface ToggleAllButtonProps {
  todos: Todo[];
  onToggleAll: () => void;
}
export const TodoButtons: React.FC<ToggleAllButtonProps> = ({
  todos,
  onToggleAll,
}) => {
  const isAllComplited =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', { active: isAllComplited })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    />
  );
};
