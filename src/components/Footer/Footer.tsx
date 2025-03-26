import React from 'react';
import FilteredTodo from '../../types/FilteredTodo';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  changeVisibleTodos: (el: FilteredTodo) => void;
  todos: Todo[];
  filtered: FilteredTodo;
  onDelete: (id: number[]) => void;
  uncompletedTodos: number;
};

export const Footer: React.FC<Props> = ({
  changeVisibleTodos,
  filtered,
  onDelete,
  todos,
}) => {
  const uncompletedTodos = () => {
    return todos.filter(td => !td.completed).length;
  };

  const completedTodos = () => {
    return todos.filter(td => td.completed).length;
  };

  const deleteCompleted = () => {
    const deleted = todos.filter(td => td.completed).map(todo => todo.id);

    onDelete(deleted);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos()} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilteredTodo).map(title => (
          <a
            key={title}
            href="#/"
            className={classNames('filter__link', {
              selected: filtered === title,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => changeVisibleTodos(title as FilteredTodo)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={completedTodos() === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
