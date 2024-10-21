import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';

import classNames from 'classnames';

type Props = {
  todos: Todo[];
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  value: string;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  onChange,
  inputRef,
  isLoading,
  value,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.map(todo => todo.completed).length === todos.length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={onChange}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
