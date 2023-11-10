import { useEffect, useRef } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (todo: Todo) => Promise<void>;
  userId: number;
  isLoading: boolean;
  setErrorMessage: (newMessage: string) => void;
  clearError: () => void;
  todoTitle: string;
  setTodoTitle: (title: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-pattern
export const Header: React.FC<Props> = ({
  todos, onSubmit, userId, setErrorMessage, clearError, isLoading, todoTitle,
  setTodoTitle = () => { },
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // const hasActiveTodos = todos.some(todo => !todo.completed);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
      clearError();

      return;
    }

    onSubmit({
      id: 0, userId, title: todoTitle.trim(), completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      { todos.length > 0 && (
        <button
          type="button"
          // className={`todoapp__toggle-all ${hasActiveTodos ? 'active' : ''}`}
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
          aria-label="Toggle button message"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
