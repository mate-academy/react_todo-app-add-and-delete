/* eslint-disable no-console */
import React from 'react';
import { ErrorMessage, FilteredStatus, Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';
import cn from 'classnames';

interface Props {
  count: number;
  filterValue: FilteredStatus;
  setFilterValue: React.Dispatch<React.SetStateAction<FilteredStatus>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  setErrorMessage: (value: ErrorMessage) => void;
}

export const Footer = ({
  count,
  filterValue,
  setFilterValue,
  todos,
  setTodos,
  inputRef,
  setErrorMessage,
}: Props) => {
  const onClear = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodos(todo.id)))
      .then(results => {
        const successfullyDeletedIds: number[] = [];
        const failedToDelete = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfullyDeletedIds.push(completedTodos[index].id);
            console.log(
              `Завдання з ID ${completedTodos[index].id} видалено успішно.`,
            );
          } else {
            failedToDelete.push({
              id: completedTodos[index].id,
              error: result.reason,
            });

            setErrorMessage(ErrorMessage.DELETE);

            console.error(
              `Помилка видалення завдання з ID ${completedTodos[index].id}:`,
              result.reason,
            );
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        return results;
      })
      .finally(() => {
        inputRef.current?.focus();
      });
  };

  const allFilters = Object.values(FilteredStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {allFilters.map(filter => (
          <a
            key={filter}
            href={`#/${filter !== FilteredStatus.ALL ? filterValue.toLowerCase() : ''}`}
            className={cn('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterValue(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClear}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
