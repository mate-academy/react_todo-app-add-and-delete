import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filterType: FilterType,
  setFilterType: (filterType: FilterType) => void,
  completedTodos: Todo[],
  onDelete: (todoId: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  completedTodos,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const allCompletedTodos = completedTodos.map(completeTodo => completeTodo.id);

  const deleteAllCompletedTodos = (allCompletedTodo: number[]) => {
    allCompletedTodo.forEach(todoId => onDelete(todoId));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos === 1
          ? '1 item left'
          : `${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.ALL },
          )}
          onClick={() => setFilterType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.ACTIVE },
          )}
          onClick={() => setFilterType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.COMPLETED },
          )}
          onClick={() => setFilterType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed--hidden': !completedTodos.length },
        )}
        onClick={() => deleteAllCompletedTodos(allCompletedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
