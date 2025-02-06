import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../enums/TodoFilter';

interface TodoFooterProps {
  todos: Todo[];
  todosLeft: number;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  loading: boolean;
  clearCompletedTodos: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  todosLeft,
  filter,
  onFilterChange,
  loading,
  clearCompletedTodos,
}) => {
  const isTodos = todos.length > 0;
  const isOneTodo = todosLeft !== 1;

  return (
    <>
      {isTodos && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosLeft} item{isOneTodo ? 's' : ''} left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(TodoFilter).map(currentFilter => (
              <a
                key={currentFilter}
                href={`#/${currentFilter}`}
                className={classNames('filter__link', {
                  selected: filter === currentFilter,
                })}
                data-cy={`FilterLink${currentFilter}`}
                onClick={() => onFilterChange(currentFilter)}
              >
                {currentFilter}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={loading || !todos.some(todo => todo.completed)}
            onClick={clearCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
