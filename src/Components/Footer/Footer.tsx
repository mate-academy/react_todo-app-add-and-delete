import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter, FILTERS } from '../../types/enums/Filter';

interface Props {
  todos: Todo[];
  activeTodoCount: number;
  activeLink: string;
  onChangeActiveLink: (link: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  activeTodoCount,
  activeLink,
  onChangeActiveLink,
  onClearCompleted,
}) => {
  function handleActiveLink(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    textLink: Filter,
  ) {
    e.preventDefault();
    onChangeActiveLink(textLink);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodoCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {FILTERS.map((tetxLink, index) => {
          return (
            <a
              key={index}
              href="#/"
              className={classNames('filter__link', {
                selected: activeLink === tetxLink,
              })}
              data-cy={`FilterLink${tetxLink}`}
              onClick={e => handleActiveLink(e, tetxLink)}
            >
              {tetxLink}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some((todo: Todo) => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
