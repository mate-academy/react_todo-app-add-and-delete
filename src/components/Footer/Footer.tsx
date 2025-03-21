import React, { useMemo } from 'react';
import { FilterTodo } from '../../types/FilterTodo';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  changeVisibleTodos: (el: FilterTodo) => void;
  todos: Todo[];
  filtered: FilterTodo;
  onDelete: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  changeVisibleTodos,
  filtered,
  onDelete,
  todos,
}) => {
  const uncompletedTodos = useMemo(() => {
    return todos.filter(td => !td.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(td => td.completed).length;
  }, [todos]);

  const deleteCompleted = () => {
    const deleted = todos.filter(td => td.completed).map(todo => todo.id);

    onDelete(deleted);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {['All', 'Active', 'Completed'].map(title => (
          <a
            key={title}
            href="#/"
            className={classNames('filter__link', {
              selected: filtered === title,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => changeVisibleTodos(title as FilterTodo)}
          >
            {title}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
