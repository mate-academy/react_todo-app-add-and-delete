import { useRef, useEffect } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onAddTodo: (title: string) => void,
  setError: (error: Errors) => void,
  isLoading: boolean,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  setError,
  isLoading,
  todos,
  todoTitle,
  setTodoTitle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle
      || todoTitle.split(' ').filter(char => char.length !== 0).length === 0) {
      setError(Errors.EmptyTitle);
      throw new Error(Errors.EmptyTitle);
    }

    onAddTodo(todoTitle.trim());
  };

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>

  );
};
