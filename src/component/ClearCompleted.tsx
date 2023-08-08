import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  countActiveTodos: number,
  onClearCompleted: () => void,
};

export const ClearCompleted: React.FC<Props> = ({
  todos,
  countActiveTodos,
  onClearCompleted,
}) => {
  return (
    <button
      type="button"
      className={cn('todoapp__clear-completed', {
        hidden: todos.length === countActiveTodos,
      })}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  );
};
