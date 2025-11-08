import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import cn from 'classnames';
import * as todosService from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>;
  showError: (message: ErrorMessage) => void;
  focusHeaderInput?: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  setTodos,
  setProcessings,
  showError,
  focusHeaderInput,
}) => {
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setProcessings(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => todosService.deleteTodo(todo.id)),
    );

    const failed = results.some(result => result.status === 'rejected');

    const succeededIds = completedTodos
      .map((todo, index) => ({ todo, result: results[index] }))
      .filter(item => item.result.status === 'fulfilled')
      .map(item => item.todo.id);

    setTodos(current =>
      current.filter(todo => !succeededIds.includes(todo.id)),
    );

    if (failed) {
      showError(ErrorMessage.DeleteError);
    }

    setProcessings(prev =>
      prev.filter(id => !completedTodos.some(todo => todo.id === id)),
    );

    focusHeaderInput?.();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
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
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
