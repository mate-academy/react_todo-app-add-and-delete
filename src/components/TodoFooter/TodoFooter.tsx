import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilteredBy } from '../../types/FilteredBy';

type Props = {
  todos: Todo[],
  filteredBy: string,
  setFilteredBy: (value: FilteredBy) => void,
  handleDeleteTodo: (todoId: number) => void,
};
export const TodoFooter: React.FC<Props> = ({
  todos,
  filteredBy,
  setFilteredBy,
  handleDeleteTodo,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filteredBy === FilteredBy.All },
          )}
          onClick={() => setFilteredBy(FilteredBy.All)}
        >
          {FilteredBy.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filteredBy === FilteredBy.Active },
          )}
          onClick={() => setFilteredBy(FilteredBy.Active)}
        >
          {FilteredBy.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filteredBy === FilteredBy.Completed },
          )}
        >
          {FilteredBy.Completed}
        </a>
      </nav>
      <button
        onClick={handleClearCompleted}
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': completedTodos },
        )}
      >
        Clear completed
      </button>
    </footer>
  );
};
