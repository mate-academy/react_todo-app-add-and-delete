import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../Enums/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filter: FilterType,
  setFilter: (filter: FilterType) => void,
  onTodoDelete:(todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onTodoDelete,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const onRemoveCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onTodoDelete(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.All,
          })}
          onClick={() => {
            setFilter(FilterType.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.Active,
          })}
          onClick={() => {
            setFilter(FilterType.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          onClick={() => {
            setFilter(FilterType.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {(completedTodos.length > 0) && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onRemoveCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
