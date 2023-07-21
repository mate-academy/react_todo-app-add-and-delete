import classNames from 'classnames';
import React from 'react';
import { removeTodo } from '../../api/todos';
import { Error, Filter, Todo } from '../../types/todo';

type Props = {
  setFilter: (filter: Filter) => void;
  filter: Filter;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  filter,
  todos,
  setTodos,
  setHasError,
}) => {
  const countItems = todos.filter(todo => !todo.completed).length;
  const item = countItems > 1 ? 'items' : 'item';

  const changeFilterHandler = (
    e: React.MouseEvent<HTMLAnchorElement>,
    type: Filter,
  ) => {
    e.preventDefault();

    switch (type) {
      case Filter.All:
        setFilter(Filter.All);
        break;

      case Filter.Active:
        setFilter(Filter.Active);
        break;

      case Filter.Completed:
        setFilter(Filter.Completed);
        break;

      default:
        break;
    }
  };

  const clearCompletedHandler = () => {
    const ids = todos
      .filter(t => t.completed)
      .map(t => t.id);

    ids.forEach(id => {
      removeTodo(id)
        .catch(() => {
          setHasError(Error.Delete);
        });
    });

    setTodos(todos.filter(t => !t.completed));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItems} ${item} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
