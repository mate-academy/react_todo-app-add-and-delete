import React from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  active: boolean | undefined,
  title: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  onAdding: boolean,
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  active,
  title,
  onChange,
  onAddTodo,
  onAdding,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {!todos.length || (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active },
          )}
          aria-label="mark all"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChange}
          disabled={onAdding}
        />
      </form>
    </header>
  );
};
