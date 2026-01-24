import { useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  inputValue: string;
  todoInputRef: React.RefObject<HTMLInputElement>;
  changeError: (newErrorText: ErrorMessage | '') => void;
  onInputChange: (value: string) => void;
  onAddTodo: (title: string) => Promise<void>;
};

export const TodoappHeader: React.FC<Props> = ({
  inputValue,
  todoInputRef,
  changeError,
  onInputChange,
  onAddTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isLoading, todoInputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedValue = inputValue.trim();

    if (normalizedValue === '') {
      changeError(ErrorMessage.EmptyTitle);

      return;
    }

    changeError('');

    setIsLoading(true);
    onAddTodo(normalizedValue)
      .then(() => onInputChange(''))
      .catch(() => {})
      .finally(() => setIsLoading(false));
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
      <form onSubmit={e => handleSubmit(e)}>
        <input
          ref={todoInputRef}
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
