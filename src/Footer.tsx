import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { deleteTodos } from './api/todos';
import { TodosContext } from './TodoContext';

type Props = {
  todos: Todo[],
  active: number,
  completed: number,
  filter: FilterStatus,
  setFilter(status: FilterStatus): void,
  setTodos(todosArray: Todo[]): void,
};

export const Footer: React.FC<Props> = ({
  todos,
  active,
  completed,
  filter,
  setFilter,
  setTodos,
}) => {
  const { setIsDeleteError } = useContext(TodosContext);
  const removeCompleted = async () => {
    const completedTodos = [...todos].filter(todo => todo.completed);

    setIsDeleteError(false);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodos(todo.id)));

      setTodos(
        [...todos].filter(todo => !todo.completed),
      );
    } catch {
      setIsDeleteError(true);
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${active} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === FilterStatus.all },
          )}
          onClick={() => {
            setFilter(FilterStatus.all);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === FilterStatus.active },
          )}
          onClick={() => {
            setFilter(FilterStatus.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === FilterStatus.completed },
          )}
          onClick={() => {
            setFilter(FilterStatus.completed);
          }}
        >
          Completed
        </a>
      </nav>

      {completed > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => removeCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
