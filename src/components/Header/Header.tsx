import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  hasTodos: boolean,
  hasCompletedTodos: boolean,
  fetchNewTodo: (title: string) => void,
  isDisable: boolean,
};

export const Header: React.FC<Props> = ({
  hasTodos,
  hasCompletedTodos,
  fetchNewTodo,
  isDisable,
}) => {
  const [titleTodo, setTitleTodo] = useState('');

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          aria-label="completed"
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: !hasCompletedTodos,
            },
          )}
        />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          fetchNewTodo(titleTodo.trim());
          setTitleTodo('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={({ target }) => {
            setTitleTodo(target.value);
          }}
          disabled={isDisable}
        />
      </form>
    </header>
  );
};
