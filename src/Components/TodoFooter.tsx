import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: (value: FilterType) => void;
  hanldeDeleteTodo:(value:number) => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  hanldeDeleteTodo,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const deleteCompletedTodos = () => {
    completedTodos.forEach(todo => hanldeDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => setFilterType(FilterType.All)}
        >
          {FilterType.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => setFilterType(FilterType.Active)}
        >
          {FilterType.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          {FilterType.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': completedTodos.length === 0 })}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
