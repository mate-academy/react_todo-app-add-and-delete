import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { StatusToFilter } from '../../types/StatusToFilter';
import { TodoFilter } from '../TodoFilter';

interface Props {
  filterStatus: string,
  onFilterStatusChange: (newStatus: StatusToFilter) => void,
  onClearAllCompletedTodos: () => void,
  todos: Todo[]
}

export const FooterTodo: React.FC<Props> = React.memo(({
  filterStatus,
  onFilterStatusChange,
  onClearAllCompletedTodos,
  todos,
}) => {
  const activeTodoListLength = useMemo(() => (
    todos.filter(todo => (!todo.completed)).length), []);

  const completedTodosLength = useMemo(() => (
    todos.length - activeTodoListLength
  ), []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodoListLength} items left`}
      </span>

      <TodoFilter
        onFilterStatusChange={onFilterStatusChange}
        filterStatus={filterStatus}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed--hidden': !completedTodosLength },
        )}
        onClick={() => onClearAllCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
});
