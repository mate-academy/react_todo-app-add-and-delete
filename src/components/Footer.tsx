import classNames from 'classnames';
import { SelectedFilter } from '../types/SelectedFilter';
import { Todo } from '../types/Todo';

type Props = {
  itemLeft: number;
  selectedFilter: SelectedFilter;
  setSelectedFilter: (filter: SelectedFilter) => void;
  completedTodos: Todo[];
  removeTodo: (todoId: number) => void;
  setDeletingCompletedTodos: (completedTodos: Todo[] | null) => void;
};

export const Footer: React.FC<Props> = ({
  itemLeft,
  selectedFilter,
  setSelectedFilter,
  completedTodos,
  removeTodo,
  setDeletingCompletedTodos,
}) => {
  function deleteCompletedTodos() {
    setDeletingCompletedTodos(completedTodos);
    completedTodos.forEach(todo => removeTodo(todo.id));
    // setDeletingCompletedTodos(null);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(SelectedFilter).map(button => {
          return (
            <a
              key={button}
              href={button === SelectedFilter.all ? '#/' : `#/${button}`}
              className={classNames('filter__link', {
                selected: selectedFilter === button,
              })}
              data-cy={`FilterLink${button}`}
              onClick={() => setSelectedFilter(button)}
            >
              {button}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
