import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../../types/TodosFilted';

interface Props {
  activeTodosAmount: number
  todos: Todo[]
  todoFilter: TodosFilter
  onFilterClick: (type: TodosFilter) => void
  onRemove: (id: number) => void
}

export const Footer: React.FC<Props> = React.memo((
  {
    activeTodosAmount,
    todos,
    todoFilter,
    onFilterClick,
    onRemove,
  },
) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    completedTodos.forEach(({ id }) => onRemove(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} item${activeTodosAmount > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            cn(
              'filter__link',
              { selected: todoFilter === TodosFilter.All },
            )
          }
          onClick={() => onFilterClick(TodosFilter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: todoFilter === TodosFilter.Active },
            )
          }
          onClick={() => onFilterClick(TodosFilter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: todoFilter === TodosFilter.Completed },
            )
          }
          onClick={() => onFilterClick(TodosFilter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={
          cn(
            'todoapp__clear-completed',
            { 'todoapp--invisible': completedTodos.length === 0 },
          )
        }
        disabled={completedTodos.length === 0}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
});
