/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

enum FilterOption {
  Default = '',
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {};

function filterTodos(option: FilterOption, todos: Todo[]) {
  const filteredTodos = todos.filter(todo => {
    switch (option) {
      case FilterOption.Active: {
        return todo.completed === false;
      }

      case FilterOption.Completed: {
        return todo.completed === true;
      }

      default: {
        return todo;
      }
    }
  });

  return filteredTodos;
}

const OPTIONS = [FilterOption.All, FilterOption.Completed, FilterOption.Active];

export const Footer: React.FC<Props> = () => {
  const {
    todos,
    setFilteredTodos,
    handleRemoveTodo,
    isTodoChange,
  } = useContext(TodosContext);
  const [selectedOption, setSelectedOption] = useState(FilterOption.Default);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setSelectedOption(FilterOption.All);
  }, []);

  useEffect(() => {
    setFilteredTodos(filterTodos(selectedOption, todos));
    setHasCompleted(todos.some(todo => todo.completed));
  }, [selectedOption, isTodoChange]);

  const handleFilterTodos = (option: FilterOption) => {
    setFilteredTodos(filterTodos(option, todos));
    setSelectedOption(option);
  };

  const removeAllCompletedTodos = () => {
    const completedTodos = filterTodos(FilterOption.Completed, todos);

    completedTodos.forEach(todo => handleRemoveTodo(todo));
    setHasCompleted(false);
  };

  const counterTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {OPTIONS.map(option => {
          const isSelected = selectedOption === option;

          return (
            <a
              key={option}
              href={`#/${option.toLowerCase()}`}
              data-cy={`FilterLink${option}`}
              className={cn(
                'filter__link',
                { selected: isSelected },
              )}
              onClick={() => handleFilterTodos(option)}
            >
              {option}
            </a>
          );
        })}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        onClick={removeAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
