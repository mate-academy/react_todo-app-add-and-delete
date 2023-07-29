import React from 'react';
import cn from 'classnames';
import { Filter, Todo } from '../types/Todo';

type Props = {
  todos: Todo[]
  filterTodos: string,
  setFilterTodos: (value: Filter) => void,
  deleteCompletedTodos: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterTodos,
  setFilterTodos,
  deleteCompletedTodos,
}) => {
  const itemsLeftTodo = todos.filter(todo => !todo.completed).length;
  const showClearButton = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeftTodo} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          onClick={() => {
            setFilterTodos(Filter.ALL);
          }}
          className={cn('filter__link', {
            selected: filterTodos === Filter.ALL,
          })}
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => {
            setFilterTodos(Filter.ACTIVE);
          }}
          className={cn('filter__link', {
            selected: filterTodos === Filter.ACTIVE,
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => {
            setFilterTodos(Filter.COMPLETED);
          }}
          className={cn('filter__link', {
            selected: filterTodos === Filter.COMPLETED,
          })}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          disabled: !showClearButton,
        })}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
