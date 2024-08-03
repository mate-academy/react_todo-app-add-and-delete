import { FilterTodo, Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  completedTodos: Todo[];
  setFilter: (filter: FilterTodo) => void;
  filter: FilterTodo;
  setTodos: (todos: Todo[]) => void;
  onRemoveCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  completedTodos,
  setFilter,
  filter,
  onRemoveCompleted,
}) => {
  const countActiveTodo = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodo} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTodo).map(item => (
          <a
            key={item}
            href={`#/${item === 'All' ? '' : item.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: item === filter,
            })}
            data-cy={`FilterLink${item}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onRemoveCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
