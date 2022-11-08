import React, { useMemo } from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  handleStatusSelect: (status: TodoStatus) => void;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  todoStatus,
  handleStatusSelect,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: todoStatus === TodoStatus.All },
          )}
          onClick={() => handleStatusSelect(TodoStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: todoStatus === TodoStatus.Active },
          )}
          onClick={() => handleStatusSelect(TodoStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: todoStatus === TodoStatus.Completed },
          )}
          onClick={() => handleStatusSelect(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
