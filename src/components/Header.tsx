import { Todo } from '../types/Todo';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  newTitleTodo: string;
  handleChangeNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmptyLineError: (event: React.FormEvent) => void;
  errorMessage: string;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  todos,
  newTitleTodo: newTitleTodo,
  handleChangeNewTitle,
  handleEmptyLineError,
  errorMessage,
  tempTodo,
}) => {
  const allChecked = todos.every(todo => todo.completed);
  const newRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newRef.current?.focus();
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allChecked,
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleEmptyLineError}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTitleTodo}
          onChange={handleChangeNewTitle}
          disabled={!!tempTodo}
          ref={newRef}
        />
      </form>
    </header>
  );
};
