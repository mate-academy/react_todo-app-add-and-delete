import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  status: string;
  setStatus: (status: string) => void;
  onDelete: (todoId: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  onDelete,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed);
  const todosCompleted = todos.some(todo => todo.completed);
  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: status === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: status === 'completed' })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed', {
            'todoapp__hidden-button': !todosCompleted,
          },
        )}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
