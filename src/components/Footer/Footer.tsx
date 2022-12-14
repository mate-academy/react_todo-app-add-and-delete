/* eslint-disable no-console */
import classNames from 'classnames';
import React from 'react';
import { removeTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onSetFilterGlobal: React.Dispatch<React.SetStateAction<string>>
  selectedFilter: string
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  toLoad:() => Promise<void>
  onSetisDeletedComplete: React.Dispatch<React.SetStateAction<boolean>>
};

export const Footer: React.FC<Props> = ({
  todos,
  onSetFilterGlobal,
  selectedFilter,
  onSetIsError,
  onSetTypeError,
  toLoad,
  onSetisDeletedComplete,
}) => {
  const amountActiveTodos = todos.filter(
    todo => todo.completed === false,
  ).length;
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    title: string,
  ) => {
    e.preventDefault();
    onSetFilterGlobal(title);
  };

  const compTodos = todos.filter(todo => todo.completed);

  console.log(compTodos);
  const clearCompletedTodos = () => {
    compTodos.forEach(async (a) => {
      console.log(a);
      try {
        onSetisDeletedComplete(true);
        await removeTodo(a.id);
      } catch (inError) {
        console.log('ERROR DELETE', inError);
        onSetIsError(false);
        onSetTypeError(Errors.ErrDEL);
      }

      onSetisDeletedComplete(false);
      onSetFilterGlobal(Filter.ALL);
      toLoad();
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${amountActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          title={Filter.ALL}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.ALL },
          )}
          onClick={event => handleAnchorClick(event, event.currentTarget.title)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          title={Filter.ACTIVE}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.ACTIVE },
          )}
          onClick={event => handleAnchorClick(event, event.currentTarget.title)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          title={Filter.COMPLETED}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.COMPLETED },
          )}
          onClick={event => handleAnchorClick(event, event.currentTarget.title)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__hidden': !compTodos.length,
          },
        )}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
