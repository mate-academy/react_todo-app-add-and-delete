import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  itemsLeft: number;
  todos: Todo[];
  filterStatus: Filter;
  setFilterStatus: React.Dispatch<React.SetStateAction<Filter>>;
  handleDeleteTodo: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  todos,
  filterStatus,
  setFilterStatus,
  handleDeleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            setFilterStatus(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setFilterStatus(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setFilterStatus(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={() => {
          todos
            .filter(todo => todo.completed)
            .forEach(todo => handleDeleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
