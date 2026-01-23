import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  inputValue: string;
  changeError: (newErrorText: ErrorMessage | '') => void;
  onInputChange: (value: string) => void;
  onAddTodo: (title: string) => Promise<void>;
};

export const TodoappHeader: React.FC<Props> = ({
  inputValue,
  changeError,
  onInputChange,
  onAddTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent, title: string) => {
    event.preventDefault();

    const normalizedValue = title.trim();

    if (normalizedValue === '') {
      changeError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsLoading(true);
    onAddTodo(normalizedValue).finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={e => handleSubmit(e, inputValue)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => onInputChange(event.currentTarget.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
