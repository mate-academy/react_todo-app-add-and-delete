import React, { useContext } from 'react';

import cn from 'classnames';
import { Filters } from '../../types/Filters';

import { TodoListContext } from '../../contexts/TodoListContext';
import { TodoFooterType } from '../../types/TodoFooterType';
import { normalizeTodoCount } from '../../utils/utils';

export const TodoFooter: React.FC<TodoFooterType> = ({ todos }) => {
  const uncompletedTodos = todos.filter(item => !item.completed).length;
  const completedTodos = todos.filter(item => item.completed).length;
  const filtersStatus = Object.keys(Filters);

  const { currentFilter, setCurrentFilter, clearCompletedTodo } =
    useContext(TodoListContext);

  return (
    <>
      {/* Hide the footer if there are no todos */}
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {uncompletedTodos} {normalizeTodoCount(uncompletedTodos)} left
        </span>
        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {filtersStatus.map(status => (
            <a
              key={status}
              onClick={() => setCurrentFilter(status)}
              href={`#/${status.toLowerCase()}`}
              className={cn('filter__link', {
                selected: currentFilter === status,
              })}
              data-cy={`FilterLink${status}`}
            >
              {status}
            </a>
          ))}
        </nav>
        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          onClick={clearCompletedTodo}
          disabled={!completedTodos}
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
