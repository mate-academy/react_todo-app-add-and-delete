import { useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorNotification } from '../../types/ErrorNotification';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  todos: Todo[],
  setErrorMessage: (q: ErrorNotification) => void;
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  title: string;
  setTitle: (q: string) => void;
  userId: number;
  isInputDisabled: boolean;
}

export const Header: React.FC<Props> = ({
  onAdd, setErrorMessage, todos, title, setTitle, userId, isInputDisabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      const newTodo = {
        title: trimmedTitle,
        userId,
        completed: false,
      };

      onAdd(newTodo);
    } else {
      setErrorMessage(ErrorNotification.TitleError);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
