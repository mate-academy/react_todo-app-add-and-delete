import React from 'react';
import classNames from 'classnames';
import { FilterParam } from '../../types/FilterParam';
import { Todo } from '../../types/Todo';
import {
  checkCompletedTodo,
  counterOfActiveTodos,
  filterTodos,
} from '../../helpers/helpers';

type Props = {
  todos: Todo[],
  filterType: FilterParam,
  setFilterType: (type: FilterParam) => void,
  removeTodo: (todoId: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  removeTodo,
}) => {
  const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.text;

    switch (href) {
      case FilterParam.All:
        return setFilterType(FilterParam.All);

      case FilterParam.Active:
        return setFilterType(FilterParam.Active);

      case FilterParam.Completed:
        return setFilterType(FilterParam.Completed);

      default:
        return setFilterType(FilterParam.All);
    }
  };

  const removeCompletedTodos = () => {
    if (checkCompletedTodo(todos)) {
      const completedTodos = filterTodos(todos, FilterParam.Completed);

      completedTodos.map(todo => removeTodo(todo.id));
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${counterOfActiveTodos(todos)} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterParam).map(link => (
          <a
            key={link}
            href={`#/${link.toLowerCase()}`}
            className={classNames(
              'filter__link',
              {
                selected: link === filterType,
              },
            )}
            onClick={handleFilterChange}
          >
            {link}
          </a>
        ))}
      </nav>

      {checkCompletedTodo(todos) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompletedTodos}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
