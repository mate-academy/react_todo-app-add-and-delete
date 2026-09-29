import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

import * as client from '../../api/todos';

import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  currentFilter: Filters;
  setCurrentFilter: Dispatch<SetStateAction<Filters>>;
  setDeletingTodoIds: Dispatch<SetStateAction<number[]>>;
  setError: (error: string) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setTodos,
  currentFilter,
  setCurrentFilter,
  setDeletingTodoIds,
  setError,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => todo.completed === false).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filters.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setCurrentFilter(Filters.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filters.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setCurrentFilter(Filters.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filters.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setCurrentFilter(Filters.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed === true)}
        onClick={() => {
          const completedTodos = todos.filter(todo => todo.completed === true);

          setDeletingTodoIds(completedTodos.map(todo => todo.id));

          completedTodos.forEach(todo => {
            client
              .deleteTodo(todo.id)
              .then(() => {
                setTodos(previousTodos =>
                  previousTodos?.filter(item => item.id !== todo.id),
                );
              })
              .catch(() => {
                setError('Unable to delete a todo');
              })
              .finally(() => {
                setDeletingTodoIds(previousIds =>
                  previousIds.filter(id => id !== todo.id),
                );
              });
          });

          // setTodos(todos.filter(todo => todo.completed !== true));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
