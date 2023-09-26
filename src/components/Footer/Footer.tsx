import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
// import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';
// import { ErrorMessage } from '../../types/errorMessage';
import { Filter } from '../../types/filter';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Filter,
  setFilter: (f: Filter) => void,
};

export const Footer: React.FC<Props> = ({ filter, setFilter }) => {
  const {
    todos,
    // setTodos, errorNotificationHandler,
    deletingTodoHandler,
  } = useContext(TodosContext);
  const notCompletedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => todo.completed === false);
  }, [todos]);

  const completedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => todo.completed === true);
  }, [todos]);

  // const clearCompletedHandler = () => {
  //   completedTodos.forEach((currTodo) => {
  //     deleteTodo(currTodo.id)
  //       .then(
  //         () => setTodos(todos.filter(todo => todo.id !== currTodo.id)),
  //       )
  //       .catch(() => errorNotificationHandler(ErrorMessage.DELETE));
  //   });
  // };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ALL },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ACTIVE },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.COMPLETED },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        style={{
          visibility: completedTodos.length > 0 ? 'visible' : 'hidden',
        }}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deletingTodoHandler(...completedTodos.map(t => t.id))}
      >
        Clear completed
      </button>

    </footer>
  );
};
