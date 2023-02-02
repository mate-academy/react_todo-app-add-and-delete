/* eslint-disable curly */
import classNames from 'classnames';
import { useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  filter: Filter,
  setFilter: (arg: Filter) => void,
  todos: Todo[] | null,
  setErrorsArgument: (argument: Error | null) => void,
  setTodos: (currentTodos: Todo[]) => void,
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  setTodos,
  setErrorsArgument,
}) => {
  const [isActive, setIsActive] = useState(true);

  const getItemsIsLeft = () => {
    let countActiveTodos = 0;

    if (!todos) return countActiveTodos;

    for (let i = 0; i < todos?.length; i += 1) {
      if (!todos[i].completed) {
        countActiveTodos += 1;
      }
    }

    return countActiveTodos;
  };

  const checkTodosHasCompletedTodo = () => {
    if (todos) {
      for (let i = 0; i < todos.length; i += 1) {
        if (todos[i].completed) {
          return true;
        }
      }
    }

    return false;
  };

  const removeAllCompletedTodos = () => {
    if (todos) {
      setIsActive(false);
      for (let i = 0; i < todos.length; i += 1) {
        if (todos[i].completed) {
          deleteTodo(todos[i].id)
            .catch(() => setErrorsArgument(Error.Delete));
        }
      }

      setTodos(todos.filter(item => !item.completed));

      setIsActive(true);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${getItemsIsLeft()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classNames('filter__link', { selected: filter === Filter.All })
          }
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classNames('filter__link', { selected: filter === Filter.Active })
          }
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: filter === Filter.Completed },
            )
          }
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        style={
          { visibility: checkTodosHasCompletedTodo() ? 'visible' : 'hidden' }
        }
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => removeAllCompletedTodos()}
        disabled={!isActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
