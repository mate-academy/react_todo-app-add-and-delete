import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import { useEffect, useRef } from 'react';

type Props = {
  visibleTodos: Todo[];
  title: string;
  setTitle: (title: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => void;
  errorMessage: ErrorMessage;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  receiving: boolean;
};

export const Header: React.FC<Props> = ({
  visibleTodos,
  title,
  setTitle,
  addTodo,
  errorMessage,
  setErrorMessage,
  receiving,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [visibleTodos]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    addTodo({ title: title.trim(), completed: false, userId: USER_ID });
  }

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
          value={title}
          onChange={event => {
            setTitle(event.target.value);
            setErrorMessage({ ...errorMessage, emptyTitle: false });
          }}
          ref={titleField}
          disabled={receiving}
        />
      </form>
    </header>
  );
};
