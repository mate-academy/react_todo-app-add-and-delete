import { useEffect, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onAddTodo: (title: string) => Promise<void>;
  error: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
  isInputDisablet: boolean;
  isDeletedTodos: number[];
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    inputRef,
    onAddTodo,
    error,
    setErrorMessage,
    isInputDisablet,
    isDeletedTodos,
  } = props;

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isInputDisablet, isDeletedTodos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error !== ErrorMessage.Default) {
      setErrorMessage(ErrorMessage.Default);
    }

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    return onAddTodo(title.trim())
      .then(() => setTitle(''))
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isInputDisablet}
        />
      </form>
    </header>
  );
};
