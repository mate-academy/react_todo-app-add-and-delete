import cn from 'classnames';
import { Status, Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  selectedFilter: string;
  onSelect: (a: string) => void;
  count: number;
  todos: Todo[];
  setIsLoading: (e: number | null) => void;
  setErrorMessage: (m: string) => void;
};

export const Footer: React.FC<Props> = ({
  selectedFilter,
  onSelect,
  count,
  todos,
  setIsLoading,
  setErrorMessage,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(todo => {
      setIsLoading(todo.id);

      deleteTodo(todo.id)
        .catch(() => {
          setErrorMessage(`Unable to delete a todo`);
        })
        .finally(() => setIsLoading(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(Status).map(status => (
          <a
            key={status}
            href="#/"
            className={cn('filter__link', {
              selected: selectedFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => onSelect(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={() => {
          handleDeleteCompletedTodos();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
