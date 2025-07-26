import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Sort } from '../types/Sort';
import cn from 'classnames';

type Props = {
  sort: (value: Sort) => void;
  userTodo: Todo[];
  visible: boolean;
  clearDelete: (value: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  sort,
  userTodo,
  visible,
  clearDelete,
}) => {
  const [selectedAll, setSelectedAll] = useState(true);
  const [selectedActive, setSelectedActive] = useState(false);
  const [selectedComplited, setSelectedComplited] = useState(false);
  let itemsLeft = 0;

  userTodo.map(item => {
    if (!item.completed) {
      itemsLeft++;
    }
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: selectedAll })}
          data-cy="FilterLinkAll"
          onClick={() => {
            sort('all');
            setSelectedAll(true);
            setSelectedActive(false);
            setSelectedComplited(false);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: selectedActive })}
          data-cy="FilterLinkActive"
          onClick={() => {
            sort('active');
            setSelectedAll(false);
            setSelectedActive(true);
            setSelectedComplited(false);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: selectedComplited })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            sort('completed');
            setSelectedAll(false);
            setSelectedActive(false);
            setSelectedComplited(true);
          }}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={visible}
        onClick={() => clearDelete(userTodo)}
      >
        Clear completed
      </button>
    </footer>
  );
};
