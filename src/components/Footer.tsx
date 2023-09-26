import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodoContext';

export const Footer = () => {
  const { todos, handleSelectFilter, selectedFilter }
    = useContext(TodosContext);
  const todosLeft = todos.filter(todo => !todo.completed);
  const todosDone = todos.filter(todo => todo.completed);

  return (
    <div>
      {todos.length !== 0
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosLeft.length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleSelectFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleSelectFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleSelectFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className={cn({
                'todoapp__clear-completed': true,
                'todoapp__clear-completed--disabled': todosDone.length === 0,
              })}
              data-cy="ClearCompletedButton"
              disabled={todosDone.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
    </div>
  );
};
