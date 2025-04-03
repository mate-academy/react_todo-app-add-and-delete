import React, { useCallback, useContext } from 'react';
import { Filter } from './types';
import classNames from 'classnames';
import { MainContext } from '../../ContextProvider/ContextProvider';
import { deleteTodo } from '../../api/todos';
import callError from '../../utils/callError';

const Footer: React.FC = () => {
  const { todos, setTodos, filter, setFilter, setError, setLoadingIds } =
    useContext(MainContext);

  const isClearDisabled = !todos.some(todo => todo.completed);

  const handleFilterClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      const element = event.currentTarget;
      const filterValue = element.getAttribute('data-filter');

      if (
        filterValue &&
        Object.values(Filter).includes(filterValue as Filter)
      ) {
        setFilter(filterValue as Filter);
      }
    },
    [setFilter],
  );

  const handleClearCompletedClick = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingIds(completedTodos.map(todo => todo.id));

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(res => {
        setLoadingIds([0]);

        const deletedTodos = completedTodos.filter((_t, index) => {
          return res[index].status === 'fulfilled';
        });

        if (deletedTodos.length < completedTodos.length) {
          callError(setError, 'delete');
        }

        setTodos(todos.filter(todo => !deletedTodos.includes(todo)));
      })
      .catch(() => callError(setError, 'delete'));
  }, [todos, setLoadingIds, setError, setTodos]);

  const activeNumbers = todos.filter(todo => !todo.completed).length;

  const filters = [
    { label: 'All', value: Filter.FilterLinkAll },
    { label: 'Active', value: Filter.FilterLinkActive },
    { label: 'Completed', value: Filter.FilterLinkCompleted },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeNumbers} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(({ label, value }) => (
          <a
            key={value}
            href={`#/${label.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${label}`}
            data-filter={value}
            onClick={handleFilterClick}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearDisabled}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
