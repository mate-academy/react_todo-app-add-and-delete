import { Todo } from '../../types/Todo';
import cn from 'classnames';

type HeaderProps = {
  todos: Todo[];
  query: string;
  tempTodo: Todo | null;
  addInputRef: React.RefObject<HTMLInputElement>;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Header: React.FC<HeaderProps> = ({
  todos,
  query,
  tempTodo,
  addInputRef,
  onQueryChange,
  onSubmit,
}) => {
  const completedTodo = todos?.filter(todo => todo.completed).length;

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: completedTodo === todos.length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={addInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={onQueryChange}
          disabled={tempTodo?.id === 0}
        />
      </form>
    </header>
  );
};

export default Header;
