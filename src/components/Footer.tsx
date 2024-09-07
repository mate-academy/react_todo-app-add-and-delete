import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filterValue: Filter;
  onClickFilter: (filterValue: Filter) => void;
};

const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filterValue,
  onClickFilter,
}) => {
  const isCompleted = todos.some(todo => todo.completed);

  const allNotCompleted = todos.filter(todo => !todo.completed).length;

  const allActive = todos.filter(todo => !todo.completed);

  const showFilterNavigation = Object.values(Filter).map(value => (
    <a
      key={value}
      href="#/"
      className={cn('filter__link', { selected: filterValue === value })}
      data-cy={`FilterLink${value}`}
      onClick={() => onClickFilter(value)}
    >
      {value}
    </a>
  ));

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${allNotCompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {showFilterNavigation}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleted}
        onClick={() => setTodos(allActive)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
