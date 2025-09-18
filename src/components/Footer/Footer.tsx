import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import { ErrorMessages } from '../../types/Errors';
import { FilterTypes } from '../../types/FilterTypes';

interface Props {
  todos: Todo[];
  filterType: FilterTypes;
  onFilterType: (v: FilterTypes) => void;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onLoading: React.Dispatch<React.SetStateAction<number[]>>;
  onErrorMessage: (message: ErrorMessages) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onFilterType,
  onTodos,
  onLoading,
  onErrorMessage,
}) => {
  const completedCountLength = [...todos].filter(todo => todo.completed).length;
  const activeCountLength = todos.length - completedCountLength;

  const handleFilter = (currentFilterType: FilterTypes) => {
    onFilterType(currentFilterType);
  };

  const deleteCompletedTodos = () => {
    todos.map(todo => {
      if (todo.completed) {
        onLoading(prev => [...prev, todo.id]);
        todoService
          .deleteTodos(todo.id)
          .then(() =>
            onTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            ),
          )
          .catch(() => onErrorMessage(ErrorMessages.Delete))
          .finally(() =>
            onLoading(prev => prev.filter(item => item !== todo.id)),
          );
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCountLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map(type => (
          <a
            key={type}
            href={`#/${type === 'All' ? '' : type.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterType === type,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleFilter(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCountLength === 0}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
