import { FormEventHandler, useEffect, useRef } from 'react';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  todos: Todo[];
  errorType: ErrorType;
  handleSubmit: FormEventHandler;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  todos,
  errorType,
  handleSubmit,
  tempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorType]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={tempTodo !== null}
          value={newTodoTitle}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
