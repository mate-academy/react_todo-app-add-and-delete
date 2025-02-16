import clsx from '../../../node_modules/clsx';
import { Todo } from '../../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  title: string;
  input: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  complateAllTodo: () => void;
};

export const Header: React.FC<Props> = React.memo(
  ({
    todos,
    title,
    input,
    tempTodo,
    handleTitleChange,
    handleSubmit,
    complateAllTodo,
  }) => {
    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={clsx('todoapp__toggle-all', {
              active: todos.every(item => item.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={complateAllTodo}
          />
        )}
        <form onSubmit={handleSubmit} method="post">
          <input
            data-cy="NewTodoField"
            type="text"
            value={title}
            ref={input}
            onChange={handleTitleChange}
            disabled={tempTodo !== null}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
