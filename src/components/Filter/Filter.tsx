import classNames from 'classnames';
import { useState, useContext } from 'react';
import { Todo } from '../../types/Todo';
import {
  getCompletedTodos, getTodos, getActiveTodos, deleteTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  allTodos: Todo[] | null,
  activeTodos: Todo[] | null,
  setVisibleTodos: (userTodos: Todo[]) => void,
  visibleTodos: Todo[],
}

const filters = {
  all: 'all',
  completed: 'completed',
  active: 'active',
};

export const Filter: React.FC<Props> = (props) => {
  const [selectedFilter, setSelectedFilter] = useState(filters.all);

  const {
    allTodos,
    activeTodos,
    setVisibleTodos,
    visibleTodos,
  } = props;

  const user = useContext(AuthContext);

  const editTodos = (
    functonEdit: (number: number) => Promise<Todo[]>,
    activeFilter: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (user) {
      functonEdit(user.id)
        .then((userTodos: Todo[]) => setVisibleTodos(userTodos));
    }

    setSelectedFilter(activeFilter);

    event.preventDefault();
  };

  // eslint-disable-next-line no-console
  console.log('filter');

  // eslint-disable-next-line no-console
  console.log(activeTodos);

  // eslint-disable-next-line no-console
  console.log(allTodos);

  return (
    <>
      {(allTodos && allTodos.length > 0) && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${activeTodos?.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                { filter__link: true },
                { selected: selectedFilter === filters.all },
              )}
              onClick={(event) => {
                editTodos(getTodos, filters.all, event);
              }}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                { filter__link: true },
                { selected: selectedFilter === filters.active },
              )}
              onClick={(event) => {
                editTodos(getActiveTodos, filters.active, event);
              }}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                { filter__link: true },
                { selected: selectedFilter === filters.completed },
              )}
              onClick={(event) => {
                editTodos(getCompletedTodos, filters.completed, event);
              }}
            >
              Completed
            </a>
          </nav>

          <button
            disabled={activeTodos?.length === visibleTodos.length}
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={() => {
              if (user) {
                allTodos.forEach(todo => {
                  if (todo.completed) {
                    deleteTodo(todo.id);
                  }
                });
                if (activeTodos) {
                  setVisibleTodos(activeTodos);
                }
              }
            }}
          >
            Clear completed
          </button>

        </footer>
      )}
    </>
  );
};
