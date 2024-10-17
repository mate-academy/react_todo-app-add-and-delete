import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FormEvent } from 'react';

interface HeaderProps {
  value: string;
  todos: Todo[];
  completedTodos: Todo[];
  loader: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onTodosToggle: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  value,
  todos,
  completedTodos,
  loader: isSubmitting,
  inputRef,
  onTodosToggle,
  onSubmit,
  onInputChange,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={onTodosToggle}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          ref={inputRef}
          onChange={onInputChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
