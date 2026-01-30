import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
}

export const Header: React.FC<Props> = ({ todos }) => {
    const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
    inputRef.current?.focus();
  }, []);

   function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          aria-label="New todo title"
        />
      </form>
    </header>
  );
};
