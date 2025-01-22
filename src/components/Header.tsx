import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type HeaderProps = {
  inputValue: string;
  setInputValue: (text: string) => void;
  addTodo: (title: string, userId: number, completed: boolean) => Promise<void>;
  setError: (text: string | null) => void;
  filteredTodo: Todo[];
  todoDelete: number[];
};

export const Header: React.FC<HeaderProps> = ({
  inputValue,
  setInputValue,
  addTodo,
  setError,
  filteredTodo,
  todoDelete,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError('Title should not be empty');

      setTimeout(() => {
        setError(null);
      }, 3000);

      return;
    }

    setIsLoading(true);

    const oldValue = inputValue;

    try {
      await addTodo(inputValue.trim(), USER_ID, false);
      setInputValue('');
    } catch {
      setInputValue(oldValue);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((!isLoading && inputValue === '') || inputValue !== '' || !todoDelete) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputValue, todoDelete]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: filteredTodo.every(todo => todo.completed),
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
          onChange={e => setInputValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
