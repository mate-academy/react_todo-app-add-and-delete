import React, {
  memo, useEffect, useRef, useState,
} from 'react';

interface Props {
  addTempTodo: (title: string) => void;
  disabled: boolean;
}

export const Header: React.FC<Props> = memo(({
  addTempTodo, disabled,
}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (!disabled) {
      setTitle('');
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTempTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAll"
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          disabled={disabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
