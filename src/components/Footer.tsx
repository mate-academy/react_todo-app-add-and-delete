import classNames from 'classnames';
import React, { useEffect, useState, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { deleteTodo } from '../api/todos';

type Props = {
  selectedLink: FilterType;
  setSelectedLink: (arg: FilterType) => void;
  todos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  allTodos: Todo[];
  isSubmitting: boolean;
};

export const Footer: React.FC<Props> = ({
  selectedLink,
  setSelectedLink,
  todos,
  setAllTodos,
  setErrorMessage,
  allTodos,
  isSubmitting,
}) => {
  const [remainingTodosCount, setRemainingTodosCount] = useState(0);

  const newCount = useMemo(
    () => allTodos.filter(todo => !todo.completed).length,
    [allTodos],
  );

  useEffect(() => {
    if (
      !isSubmitting &&
      selectedLink !== FilterType.active &&
      newCount !== remainingTodosCount
    ) {
      setRemainingTodosCount(newCount);
    }
  }, [selectedLink, newCount, remainingTodosCount, isSubmitting]);

  const handleClearCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(allCompletedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const failedIds = results
          .map((result, index) =>
            result.status === 'rejected' ? allCompletedTodos[index].id : null,
          )
          .filter((id): id is number => id !== null);
        const successfullyDeletedIds = allCompletedTodos
          .map(todo => todo.id)
          .filter(id => !failedIds.includes(id));

        const updatedTodos = todos.filter(
          todo => !successfullyDeletedIds.includes(todo.id),
        );

        setAllTodos(updatedTodos);
        if (failedIds.length > 0) {
          setErrorMessage('Unable to delete a todo');
        }
      },
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => (
          <a
            href="#/"
            key={type}
            className={classNames('filter__link', {
              selected: selectedLink === type,
            })}
            data-cy={type === 'All' ? 'FilterLinkAll' : `FilterLink${type}`}
            onClick={() => setSelectedLink(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
