import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  todosNumber: number;
  visibleTodos: Todo[];
  handleDeletingTodo: (todoId: number) => void;
}

export const Footer: React.FC<Props> = ({
  filter, setFilter, todosNumber, visibleTodos, handleDeletingTodo,
}) => {
  const areTodosCompleted
  = visibleTodos.filter(todo => todo.completed).length === 0;

  const handleCompletedTodosDeleting = () => {
    visibleTodos.map(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }

      return null;
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosNumber} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: filter === 'active' },
          )}
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filter === 'completed' },
          )}
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed', { hiddenButton: areTodosCompleted },
        )}
        onClick={handleCompletedTodosDeleting}
      >
        Clear completed
      </button>
    </footer>
  );
};
