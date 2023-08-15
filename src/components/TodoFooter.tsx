import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../utils/collection';

type Props = {
  todos: Todo[]
  filterTodos: string,
  setFilterTodos: (value: Filter) => void,
  clearButton: boolean,
  onDelete?: (id: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterTodos,
  setFilterTodos,
  clearButton,
  onDelete = () => {},
}) => {
  const activeItems = todos.filter(todo => !todo.completed).length;
  const completedId = todos.filter(todo => todo.completed)
    .map(todo => todo.id);

  const handleClear = () => {
    completedId.forEach(id => onDelete(id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeItems} items left`}
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
        className="todoapp__clear-completed"
        disabled={!clearButton}
        style={!clearButton ? { visibility: 'hidden' } : {}}
        onClick={handleClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
