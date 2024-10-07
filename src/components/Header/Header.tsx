import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  addNewTodo: (title: string) => void;
  title: string;
  setTitle: (value: string) => void;
  todos: Todo[];
  errorMessage: string;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  title,
  setTitle,
  todos,
  errorMessage,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, errorMessage, todos]);

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewTodo(title);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: false })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleTitleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
