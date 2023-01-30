import classNames from 'classnames';
import React from 'react';
import { deleteTodo } from '../api/todos';
import { FilterType } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export type Props = {
  todos: Todo[],
  setSortType: (arg: FilterType) => void,
  sortType: FilterType,
  removeTodos: (todoIds: number[]) => void
};

export const Footer: React.FC<Props> = ({
  todos, setSortType, sortType, removeTodos,
}) => {
  const clearCompletedTodos = async () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    await Promise.all(
      todosToDelete.map(
        todo => deleteTodo(todo.id),
      ),
    );

    removeTodos(todosToDelete.map(todo => todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classNames('filter__link',
              { selected: sortType === FilterType.ALL })
          }
          onClick={() => setSortType(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classNames('filter__link',
              { selected: sortType === FilterType.ACTIVE })
          }
          onClick={() => setSortType(FilterType.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classNames('filter__link',
              { selected: sortType === FilterType.COMPLETED })
          }
          onClick={() => setSortType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      { todos.find(todo => todo.completed)
      && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
