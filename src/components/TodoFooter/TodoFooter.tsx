import classNames from 'classnames';
import { useMemo } from 'react';

import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: FilterBy,
  setFilterBy: (v: FilterBy) => void,
  deleteTodo: (todoId: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  deleteTodo,
}) => {
  // Hide the "Clear complited" if there isn't any completed todo
  const someCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  // Set filtering by "ALL, ACTIVE or COMPLITED"
  const handleFiltering = (value: FilterBy) => {
    if (value === filterBy) {
      return;
    }

    setFilterBy(value);
  };

  // delete all complied todos
  const deleteComplitedTodos = () => {
    todos.map(todo => todo.completed && deleteTodo(todo.id));
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todos.filter(todo => !todo.completed).length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filterBy === FilterBy.ALL },
              )}
              onClick={() => handleFiltering(FilterBy.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filterBy === FilterBy.ACTIVE },
              )}
              onClick={() => handleFiltering(FilterBy.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filterBy === FilterBy.COMPLETED },
              )}
              onClick={() => handleFiltering(FilterBy.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={classNames(
              'todoapp__clear-completed',
              { 'todoapp__clear-hidden': !someCompleted },
            )}
            onClick={deleteComplitedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
