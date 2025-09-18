import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  loading: boolean;
  newTitle: string;
  onChangeTitle: (title: string) => void;
  onAdd: (value: string) => void;
  setInputRef: (ref: HTMLInputElement | null) => void;
};

const Header: React.FC<Props> = ({
  todos,
  loading,
  newTitle,
  onChangeTitle,
  onAdd,
  setInputRef,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    setInputRef(inputRef.current);
  }, [loading, setInputRef]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef.current) {
      onAdd(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        disabled={loading}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={newTitle}
          onChange={event => onChangeTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
        />
      </form>
    </header>
  );
};

export default Header;
