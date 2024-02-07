import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../Context/TodoContext';
import { Filter } from '../../types/Filter';
// import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  filter: Filter,
  setFilter: (filter: Filter) => void,
};

export const Footer: React.FC<Props> = ({ filter, setFilter }) => {
  const {
    todos,
    setTodos,
    // setLoadingCompleted,
    setHasError,
    setErrorType,
    setLoadId,
  } = useContext(TodoContext);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  function handleClick() {
    setLoadId(completedTodos.map(todo => todo.id));
    completedTodos.map(todo => {
      // setLoadingCompleted(true);
      deleteTodos(todo.id)
        .then(() => setTodos(activeTodos))
        // .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
        .catch(() => {
          setHasError(true);
          setErrorType(Errors.Delete);
        })
        // .finally(() => setLoadingCompleted(false));
        .finally(() => setLoadId([]));

      return todo;
    });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.ALL })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.ALL)}
        >
          {Filter.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.ACTIVE })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          {Filter.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.COMPLETED })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          {Filter.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClick}
      >
        Clear completed
      </button>

    </footer>
  );
};
