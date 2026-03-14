import classNames from 'classnames';
import { Todo } from './TodoList';
import { deleteTodo } from '../api/todos';
import { ErrorMessagesNotification } from '../api/todos';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type FilterBarProps = {
  todos: Todo[];
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: (error: ErrorMessagesNotification | null) => void;
};

const Footer: React.FC<FilterBarProps> = ({
  todos,
  filter,
  setFilter,
  setTodos,
  inputRef,
  setError,
}) => {
  const filters = [
    { value: Filter.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },
    {
      value: Filter.Active,
      label: 'Active',
      href: '#/active',
      cy: 'FilterLinkActive',
    },
    {
      value: Filter.Completed,
      label: 'Completed',
      href: '#/completed',
      cy: 'FilterLinkCompleted',
    },
  ];

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let hasError = false;
    const successfullyDeletedIds: number[] = [];

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
          successfullyDeletedIds.push(todo.id);
        } catch (error) {
          hasError = true;
        }
      }),
    );

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    if (hasError) {
      setError(ErrorMessagesNotification.DELETE);
    } else {
      setError(null);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {filters.map(({ value, label, href, cy }) => (
              <a
                key={value}
                href={href}
                data-cy={cy}
                className={classNames('filter__link', {
                  selected: filter === value,
                })}
                onClick={() => setFilter(value)}
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
            disabled={todos.every(todo => !todo.completed)}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};

export default Footer;
