import React, { useMemo } from 'react';
import classNames from 'classnames';
import { getFilteredTodos } from '../../../api/todos';
import { TodoStatus } from '../../../types/TodoStatus';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[];
  todoFilter: TodoStatus;
  onTodoFilter: (filterStatus: TodoStatus) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  todoFilter,
  onTodoFilter,
  onDeleteTodo,
}) => {
  const activeTodos = useMemo(() => (
    getFilteredTodos(todos, TodoStatus.ACTIVE)
  ), [todos]);

  const completedTodos = useMemo(() => (
    getFilteredTodos(todos, TodoStatus.COMPLETED)
  ), [todos]);

  const allCompleted = completedTodos.map(completeTodo => completeTodo.id);

  const handleDeleteAllCompleted = (allCompletedId: number[]) => {
    allCompletedId.forEach(todoId => onDeleteTodo(todoId));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoStatus.ALL },
          )}
          onClick={() => onTodoFilter(TodoStatus.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoStatus.ACTIVE },
          )}
          onClick={() => onTodoFilter(TodoStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoStatus.COMPLETED },
          )}
          onClick={() => onTodoFilter(TodoStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed--hidden': !completedTodos.length },
        )}
        disabled={!completedTodos.length}
        onClick={() => handleDeleteAllCompleted(allCompleted)}
      >
        Clear completed
      </button>
    </footer>
  );
};
