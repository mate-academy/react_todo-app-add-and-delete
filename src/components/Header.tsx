import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  onAddTodo: (title: string, setTitle: (title: string) => void) => void;
  isAllCompleted: boolean;
  todosLength: number;
  tempTodo: Todo | null;
  updateTodo: (updatedTodo: Todo) => void;
  inputDisabled: boolean;
  todos: Todo[];
  errorMessage: string;
}

const Header: React.FC<Props> = ({
  onAddTodo,
  isAllCompleted,
  todosLength,
  inputDisabled,
  todos,
  errorMessage,
}) => {
  const [title, setTitle] = useState('');
  const [shouldFocus, setShouldFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMessage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(title, setTitle);
    if (!title.trim()) {
      setShouldFocus(true);
    }
  };

  if (shouldFocus && inputRef.current) {
    inputRef.current.focus();
    setShouldFocus(false);
  }

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
