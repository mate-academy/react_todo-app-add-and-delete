import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { FilterStatus } from '../../types/enums';

type Props = {
  allTodos: Todo[];
  selectedValue: (value: FilterStatus) => void;
  onSelect: FilterStatus;
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  allTodos,
  selectedValue,
  onSelect,
  handleDeleteCompleted,
}) => {
  const completedTodosLength = allTodos.filter(todo => todo.completed).length;
  const isHidden = completedTodosLength === 0;

  const valueForFilter = [
    {
      href: '#/',
      dataCy: 'FilterLinkAll',
      buttonTitle: 'All',
      status: FilterStatus.All,
    },
    {
      href: '#/active',
      dataCy: 'FilterLinkActive',
      buttonTitle: 'Active',
      status: FilterStatus.Active,
    },
    {
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
      buttonTitle: 'Completed',
      status: FilterStatus.Completed,
    },
  ];

  function notCompletedTodo() {
    return allTodos.filter(todo => todo.completed === false).length;
  }

  return (
    <>
      {/* Hide the footer if there are no todos */}
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {notCompletedTodo()} items left
        </span>

        {/* Active link should have the 'selected' class */}

        <nav className="filter" data-cy="Filter">
          {valueForFilter.map(button => {
            return (
              <a
                href={button.href}
                key={button.status}
                className={cn('filter__link', {
                  selected: onSelect === button.status,
                })}
                data-cy={button.dataCy}
                onClick={() => selectedValue(button.status)}
              >
                {button.buttonTitle}
              </a>
            );
          })}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
          disabled={isHidden}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
