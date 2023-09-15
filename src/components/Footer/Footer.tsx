import classNames from 'classnames';
import { TodoFilter } from '../../types/TodoFilter';
import { Todo } from '../../types/Todo';
import './Footer.scss';

type FooterProps = {
  currentFilter: TodoFilter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<TodoFilter>>;
  todos: Todo[];
  removeTodo: (todoId: number) => void;
};

export const Footer: React.FC<FooterProps> = ({
  currentFilter,
  setCurrentFilter,
  todos,
  removeTodo,
}) => {
  const counterActive = todos.filter(todo => !todo.completed).length || 0;
  const counterCompleted = todos.length - counterActive;

  const handleFilter = (filterParam: TodoFilter) => {
    setCurrentFilter(filterParam);
  };

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${counterActive} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: currentFilter === TodoFilter.All },
          )}
          onClick={() => {
            handleFilter(TodoFilter.All);
          }}
        >
          {TodoFilter.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: currentFilter === TodoFilter.Active },
          )}
          onClick={() => {
            handleFilter(TodoFilter.Active);
          }}
        >
          {TodoFilter.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: currentFilter === TodoFilter.Completed },
          )}
          onClick={() => {
            handleFilter(TodoFilter.Completed);
          }}
        >
          {TodoFilter.Completed}
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed--hidden': !counterCompleted },
        )}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
