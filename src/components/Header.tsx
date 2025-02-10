import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';

type Props = {
  inputValue: string;
  setInputValue: (text: string) => void;
  handleCreateTodo: (
    title: string,
    userId: number,
    completed: boolean,
  ) => Promise<void>;
  setErrorMessage: (text: string | null) => void;
  todoDelete: number[];
};

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  handleCreateTodo,
  setErrorMessage,
  todoDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    setLoading(true);

    const oldValue = inputValue;

    try {
      await handleCreateTodo(inputValue.trim(), USER_ID, false);
      setInputValue('');
    } catch {
      setInputValue(oldValue);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((!loading && inputValue === '') || inputValue !== '' || !todoDelete) {
      inputRef.current?.focus();
    }
  }, [loading, inputValue, todoDelete]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: false })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
