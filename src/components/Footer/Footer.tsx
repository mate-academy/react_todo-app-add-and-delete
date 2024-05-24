import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';
import classNames from 'classnames';
import { FilterField } from '../../utils/constants';

export const Footer: React.FC = () => {
  const { todos, filterField, setFilterField, handleDeleteCompleted } =
    useContext(TodoContext);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todos.filter(todo => !todo.completed).length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterField === FilterField.ALL,
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilterField(FilterField.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterField === FilterField.ACTIVE,
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilterField(FilterField.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterField === FilterField.COMPLETED,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilterField(FilterField.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={todos.every(todo => !todo.completed)}
            style={{
              visibility: todos.every(todo => !todo.completed)
                ? 'hidden'
                : 'visible',
            }}
            onClick={handleDeleteCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
