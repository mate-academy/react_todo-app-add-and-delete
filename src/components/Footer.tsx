import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/filter';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { DELETING_ERROR } from '../utils/constants';

interface Props {
  itemsAmount: number;
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  completed: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorHandler: (str: string) => void;
}

const filterOptions = [
  { type: FilterType.All, value: 'All' },
  { type: FilterType.Active, value: 'Active' },
  { type: FilterType.Completed, value: 'Completed' },
];

export const Footer: React.FC<Props> = ({
  itemsAmount,
  setFilterType,
  filterType,
  completed,
  setTodos,
  setLoadingTodos,
  errorHandler,
}) => {
  const linkClickHandler = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    type: FilterType,
  ) => {
    event.preventDefault();
    setFilterType(type);
  };

  const clearCompleted = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoadingTodos((prevTodos) => [...prevTodos, ...completed]);

    completed.forEach((completedTodo) => {
      deleteTodo(completedTodo.id)
        .then(() => {
          setTodos((prevTodos) => prevTodos
            .filter(todo => todo.id !== completedTodo.id));
        })
        .catch(() => errorHandler(DELETING_ERROR));
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsAmount} items left`}
      </span>

      <nav className="filter">
        {filterOptions.map(({ type, value }) => {
          return (
            <a
              key={type}
              href={`#/${type.toLowerCase()}`}
              className={`filter__link ${cn({
                selected: filterType === type,
              })}`}
              onClick={(event) => linkClickHandler(event, type)}
            >
              {value}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={`todoapp__clear-completed${cn({
          '--hidden': !completed.length,
        })}`}
        onClick={(event) => clearCompleted(event)}
      >
        Clear completed
      </button>
    </footer>
  );
};
