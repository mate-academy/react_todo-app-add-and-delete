import classNames from 'classnames';
import { useState } from 'react';
import { FilterType } from './types/FilterTypeEnum';
import { Todo } from './types/Todo';

interface FilterPanelProps {
  setFilterMode: React.Dispatch<React.SetStateAction<FilterType>>,
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  setFilterMode, filteredTodos, setFilteredTodos,
}) => {
  const [activeButton, setActiveButton] = useState<FilterType>(FilterType.All);

  const hasCompletedTasks = filteredTodos.some((todo) => todo.completed);
  const activeTodoCounter = filteredTodos.reduce((counter, todo) => {
    if (!todo.completed) {
      // eslint-disable-next-line no-param-reassign
      counter += 1;
    }

    return counter;
  }, 0);

  const leftTodosText = (activeTodoCounter === 1) ? '1 item left' : `${activeTodoCounter} items left`;

  const handleTodoMode = (filterName: FilterType) => {
    setFilterMode(filterName);
    setActiveButton(filterName);
  };

  const clearCompletedTodos = () => {
    const activeTodos = filteredTodos.filter((todo) => !todo.completed);

    setFilteredTodos(activeTodos);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {leftTodosText}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeButton === 'All',
          })}
          onClick={() => handleTodoMode(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeButton === 'Active',
          })}
          // onClick={() => showActiveTodos(FilterType.Active)}
          onClick={() => handleTodoMode(FilterType.Active)}

        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeButton === 'Completed',
          })}
          onClick={() => handleTodoMode(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {hasCompletedTasks && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
