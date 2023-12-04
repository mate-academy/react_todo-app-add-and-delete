import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: Filter,
  setFilter: (value: Filter) => void,
  deleteTodo: (todoId: number) => void,
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setTodos,
  setFilter,
  deleteTodo,
}) => {
  const hasCompleted = todos.some(todo => todo.completed === true);
  const todosCounter = todos.filter(todo => todo.completed === false).length;

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return todo;
    }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} ${todosCounter === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
