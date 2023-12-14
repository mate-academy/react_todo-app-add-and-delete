import React, { useContext } from 'react';
import classNames from 'classnames';

import { TodoContext } from '../TodoContext';
import { Filter } from '../../types/Filter';

export const Footer: React.FC = () => {
  const {
    todos,
    option,
    deleteTodo,
    setOption,
  } = useContext(TodoContext);

  const todoCounter = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed);
  const isDisabled = !completedTodo.length;

  const handleDeleteCompleted = () => {
    completedTodo.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounter === 1
          ? `${todoCounter} item left`
          : `${todoCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: option === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setOption(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: option === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setOption(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: option === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setOption(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabled}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
