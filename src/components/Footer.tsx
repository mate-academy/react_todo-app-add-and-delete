import { Todo } from '../types/Todo';
import React from 'react';
import { deleteTodo } from '../api/todos';
import { ErrorType } from '../enums/error';

type Props = {
  todos: Todo[];
  sortBy: string;
  setSortBy: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<number[] | null>>;
  setHasError: React.Dispatch<React.SetStateAction<string>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  sortBy,
  setSortBy,
  setTodos,
  setLoading,
  setHasError,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const hasAnyCompletedTodo: boolean =
    todos.filter((todo: Todo) => todo.completed === true).length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter((todo: Todo) => todo.completed === false).length} items
        left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          // className="filter__link selected"
          className={sortBy === '' ? 'filter__link selected' : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => setSortBy('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            sortBy === 'active' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setSortBy('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            sortBy === 'completed' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setSortBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasAnyCompletedTodo}
        data-cy="ClearCompletedButton"
        onClick={() => {
          const completedTodos = todos.filter(todo => todo.completed);
          const completedIds = completedTodos.map(todo => todo.id);

          setLoading(prev => [...(prev || []), ...completedIds]);

          Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
            .then(results => {
              const successfulIds: number[] = [];
              const failed = results.some(r => r.status === 'rejected');

              results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                  successfulIds.push(completedTodos[index].id);
                }
              });

              // Видаляємо тільки ті, що успішні
              setTodos(current =>
                current.filter(todo => !successfulIds.includes(todo.id)),
              );

              if (failed) {
                setHasError(ErrorType.DELETE);
              }
            })
            .finally(() => {
              setLoading(prev =>
                (prev || []).filter(id => !completedIds.includes(id)),
              );
            });
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
