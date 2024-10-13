import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todoStatus: Status;
  setTodoStatus: (status: Status) => void;
  onDelete: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  todoStatus,
  setTodoStatus,
  onDelete,
}) => {
  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const activeTodosCount = useMemo(() => {
    return todos.reduce((sum, todo) => sum + Number(!todo.completed), 0);
  }, [todos]);

  const handleDelete = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status}`}
            className={classNames('filter__link', {
              selected: status === todoStatus,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setTodoStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
