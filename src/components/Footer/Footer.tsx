import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { handleError } from '../../services/ErrorHandling';
import { ErrorType } from '../../types/Error';

interface Props {
  todosList: Todo[];
  todosCounter: number;
  all: boolean;
  active: boolean;
  completed: boolean;
  onDelete: (id: number) => void;
  setAll: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorType: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

export const Footer: React.FC<Props> = ({
  todosList,
  todosCounter,
  all,
  active,
  completed,
  onDelete,
  setAll,
  setActive,
  setCompleted,
  setActiveTodo,
  setErrorType,
}) => {
  const clearCompleted = async () => {
    const completedTodos = [...todosList].filter(current => current.completed);
    const promiseArray = completedTodos.map((todo: Todo) => onDelete(todo.id));

    setActiveTodo([...completedTodos]);

    try {
      await Promise.all([...promiseArray]);
    } catch (error) {
      handleError(setErrorType, { type: 'delete', time: Date.now() });
      throw error;
    }
  };

  const filterTodos = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const filterParam: string = event.currentTarget.textContent;

    if (filterParam === 'All') {
      setAll(true);
      setActive(false);
      setCompleted(false);
    }

    if (filterParam === 'Active') {
      setAll(false);
      setActive(true);
      setCompleted(false);
    }

    if (filterParam === 'Completed') {
      setAll(false);
      setActive(false);
      setCompleted(true);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: all })}
          data-cy="FilterLinkAll"
          onClick={filterTodos}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', { selected: active })}
          data-cy="FilterLinkActive"
          onClick={filterTodos}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', { selected: completed })}
          data-cy="FilterLinkCompleted"
          onClick={filterTodos}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={todosCounter === todosList.length}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
