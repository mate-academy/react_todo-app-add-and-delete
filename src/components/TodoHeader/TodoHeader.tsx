import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  allCompleted: boolean;
  onAddTodo: (title: string) => void;
  isAdding: boolean;
}

export const TodoHeader: React.FC<Props> = ({
  allCompleted,
  onAddTodo,
  isAdding,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    onAddTodo(inputValue);
    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
