import React, { useCallback, useMemo } from 'react';
import { FC, memo, ReactNode } from 'react';
import { Todo } from '../types';

type Props = {
  todos: Todo[];
  children: ReactNode;
  onDelete: (id: Todo['id']) => void;
};

export const Footer: FC<Props> = memo(({ todos, children, onDelete }) => {
  const itemsLeft = useMemo(
    () => todos.filter(({ completed }) => !completed).length,
    [todos],
  );

  const hasCompletedTodo = useMemo(
    () => todos.some(({ completed }) => completed),
    [todos],
  );

  const handeDeleteAllCompletedTodo = useCallback(
    () =>
      todos
        .filter(({ completed }) => completed)
        .forEach(({ id }) => onDelete(id)),
    [onDelete, todos],
  );

  return todos.length ? (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {children}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={handeDeleteAllCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  ) : null;
});

Footer.displayName = 'FooterMemo';
