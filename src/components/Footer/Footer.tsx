import React from 'react';
import { FilterOptions } from '../../types/FilterOptions';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  todosFilter: FilterOptions;
  errorMessage: string;
  setTodos: (todos: Todo[]) => void;
  setTodosFilter: (filterState: FilterOptions) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  todosFilter,
  errorMessage,
  setTodos,
  setTodosFilter,
  setErrorMessage,
  inputRef,
}) => {
  const visibleClearButton = todos.some(todo => todo.completed);
  let filteredTodos: Todo[] = [...todos];

  const groupTodosDelete = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        deleteTodo(todo.id)
          .then(() => {
            filteredTodos = filteredTodos.filter(
              someTodo => someTodo.id !== todo.id,
            );
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');

            if (!errorMessage) {
              setTimeout(() => {
                setErrorMessage('');
              }, 3000);
            }
          });
      });

    setTimeout(() => {
      setTodos(filteredTodos);
      inputRef.current?.focus();
    }, 190);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(option => {
          return (
            <a
              href={`#/${option}`}
              className={cn('filter__link', {
                selected: option === todosFilter,
              })}
              data-cy={`FilterLink${option}`}
              key={option}
              onClick={() => setTodosFilter(option)}
            >
              {option}
            </a>
          );
        })}

        {/* <a
          name="all"
          href="#/"
          className="filter__link"
          data-cy="FilterLinkAll"
          ref={selectedFilter}
          onClick={something}
        >
          All
        </a>

        <a
          name="active"
          href="#/active"
          className="filter__link"
          data-cy="FilterLinkActive"
          onClick={something}
        >
          Active
        </a>

        <a
          name="completed"
          href="#/completed"
          className="filter__link"
          data-cy="FilterLinkCompleted"
          onClick={something}
        >
          Completed
        </a> */}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!visibleClearButton}
        onClick={groupTodosDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
