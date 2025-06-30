import { useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../api/todos';

type Props = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void;
  todos: Todo[];
  ToggleAllTodos: () => void;
  setError: (value: React.SetStateAction<string | null>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: React.SetStateAction<string>) => void;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  todos,
  ToggleAllTodos,
  setError,
  isLoading,
  inputRef,
  inputValue,
  setInputValue,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError('Title should not be empty');

      return;
    }

    onSubmit({
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={ToggleAllTodos}
        />
      )}

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
          autoFocus
        />
      </form>
    </header>
  );
};
