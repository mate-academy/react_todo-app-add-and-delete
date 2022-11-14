/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  addTodo: (title: string) => void,
  isAdding: boolean,
  activeTodosQuantity: number,
};

export const Header: React.FC<Props> = ({
  addTodo,
  isAdding,
  activeTodosQuantity,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodosQuantity },
        )}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        addTodo(title);
        setTitle('');
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
