import cn from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  isAllCompleted: boolean;
  onSubmit: (event: React.FormEvent) => void;
  query: string;
  onQueryChange: (str: string) => void;
  isSubmitting: boolean;
  todoFieldRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  isAllCompleted,
  onSubmit,
  query,
  onQueryChange,
  isSubmitting,
  todoFieldRef,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={event => onSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          disabled={isSubmitting}
          ref={todoFieldRef}
        />
      </form>
    </header>
  );
};
