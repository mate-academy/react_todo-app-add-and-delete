import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { FilterTodo } from './FilterTodo';
import { DataCy } from '../types/DataCy';

interface Props {
  activeTodos: Todo[],
  filter: Filter,
  setFilter: (filter: Filter) => void,
  completedTodos: Todo[],
  deleteCompletedTodos: () => void,
}

export const Footer:React.FC<Props> = ({
  activeTodos,
  filter,
  setFilter,
  completedTodos,
  deleteCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodos.length} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <FilterTodo
        selectedFilter={filter}
        setFilter={setFilter}
        filterType={Filter.All}
        dataCy={DataCy.All}
      />

      <FilterTodo
        selectedFilter={filter}
        setFilter={setFilter}
        filterType={Filter.Active}
        dataCy={DataCy.Active}
      />

      <FilterTodo
        selectedFilter={filter}
        setFilter={setFilter}
        filterType={Filter.Completed}
        dataCy={DataCy.Completed}
      />
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className={classNames(
        'todoapp__clear-completed',
        { hidden: !completedTodos.length },
      )}
      onClick={deleteCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
