import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Filter } from '../App';

type Props = {
  todos: Todo[];
  setFilter: (value: Filter) => void;
  removeTodo: (todo: Todo) => void;
  filter: string;
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  filter,
  removeTodo,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  function removeCompleted() {
    todos.forEach(todo => todo.completed && removeTodo(todo));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterOption => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={() => setFilter(filterOption)}
            key={filterOption}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.find(todo => todo.completed)}
        onClick={removeCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
