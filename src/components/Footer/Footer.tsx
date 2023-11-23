import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../context/TodosContext';
import { getActiveTodos, getCompletedTodos } from '../../services/todosService';
import { Status } from '../../enums/Status';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    status,
    setTodos,
    setStatus,
    setError,
    setErrorTimeout,
    setProcessingTodos,
  } = useContext(TodosContext);

  const clearCompletedTodos = () => {
    const completedTodos = getCompletedTodos(todos);
    const deletePromises: Promise<number>[] = [];

    for (let i = 0; i < completedTodos.length; i += 1) {
      deletePromises[deletePromises.length] = deleteTodo(completedTodos[i].id);
    }

    setProcessingTodos(completedTodos.map(todo => todo.id));

    Promise.all(deletePromises)
      .then(() => {
        const newTodos = [...todos];

        for (let i = 0; i < completedTodos.length; i += 1) {
          newTodos.splice(newTodos.indexOf(completedTodos[i]), 1);
        }

        setTodos(newTodos);
      })
      .catch(() => {
        setError({ message: 'Failed delete completed todos', isError: true });
        setErrorTimeout();
      })
      .finally(() => setProcessingTodos(
        processedTodosIds => processedTodosIds.filter((id) => {
          const completedTodosIds = completedTodos.map(todo => todo.id);

          return !completedTodosIds.includes(id);
        }),
      ));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getActiveTodos(todos).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: status === Status.All })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: status === Status.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={{
          visibility: getCompletedTodos(todos).length === 0
            ? 'hidden'
            : 'visible',
        }}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
