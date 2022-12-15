import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

interface Props {
  filter: FilterType;
  onSetFilter: (newType: FilterType) => void;
  activeTodosCount: number;
  completedTodos: Todo[];
  onTodoDelete: (todosId: number[]) => void;
}

export const BottomBar: React.FC<Props> = (props) => {
  const {
    filter,
    onSetFilter,
    activeTodosCount,
    completedTodos,
    onTodoDelete,
  } = props;
  const onClearCompleted = () => {
    const completedTodosId = completedTodos.map(todo => todo.id);

    onTodoDelete(completedTodosId);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filter === FilterType.All,
            },
          )}
          onClick={() => onSetFilter(FilterType.All)}
        >
          {FilterType.All}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filter === FilterType.Active,
            },
          )}
          onClick={() => onSetFilter(FilterType.Active)}
        >
          {FilterType.Active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filter === FilterType.Completed,
            },
          )}
          onClick={() => onSetFilter(FilterType.Completed)}
        >
          {FilterType.Completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
