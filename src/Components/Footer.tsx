import React, { RefObject } from 'react';
import { Filter, Todo } from '../types/Todo';

interface FooterProps {
  setLoadingTodoIds: (value: number[] | null) => void;
  deleteTodo: (todoId: number) => Promise<void>;
  setErrorMessage: (value: string) => void;
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  inputRef: RefObject<HTMLInputElement>;
  filter: Filter;
  setFilter: (value: Filter) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setLoadingTodoIds,
  deleteTodo,
  setErrorMessage,
  todos,
  setTodos,
  inputRef,
  filter,
  setFilter,
}) => {
  function handleDeleteAllCompletedTodos(completedTodos: Todo[]) {
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(completedIds);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          return Promise.reject(todo.id);
        }),
    );

    Promise.allSettled(deletePromises)
      .then(results => {
        const successfulIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<number>).value);

        const failedIds = results
          .filter(result => result.status === 'rejected')
          .map((_, index) => completedIds[index]);

        setTodos(todos.filter(todo => !successfulIds.includes(todo.id)));

        if (failedIds.length > 0) {
          setErrorMessage('Unable to delete some todos');
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(null);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed && todo.id !== -1).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => {
          const completedTodos = todos.filter(todo => todo.completed);

          handleDeleteAllCompletedTodos(completedTodos);
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
