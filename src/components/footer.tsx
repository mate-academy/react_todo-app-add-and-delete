import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todoList: Todo[];
  selectedFilter: string;
  setSelectedFilter: (filter: Filter) => void;
  handleDeleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todoList,
  selectedFilter,
  setSelectedFilter,
  handleDeleteCompletedTodo,
}) => {
  const TodoItemsLeft = todoList.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {TodoItemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: selectedFilter === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todoList.filter(todo => todo.completed).length < 1}
        onClick={handleDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
