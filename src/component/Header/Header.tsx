import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  isAllCompleted: boolean;
  onAddingTodo: (value: string) => Promise<void>;
  todosCount: number;
};

export const Header = ({ isAllCompleted, onAddingTodo, todosCount }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, todosCount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = inputRef.current?.value.trim() || '';

    if (!value) {
      onAddingTodo(value).catch(() => {});

      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      await onAddingTodo(value);

      inputRef.current!.focus();
      inputRef.current!.value = '';
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
