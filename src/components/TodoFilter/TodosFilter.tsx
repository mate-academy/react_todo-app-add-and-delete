import React, { useMemo } from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import { Todo } from '../../types/Todo';
import { FilterControls } from './FilterConstrols';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  handleStatusSelect: (status: TodoStatus) => void;
  onDelete: () => Promise<void>;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  todoStatus,
  handleStatusSelect,
  onDelete,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <FilterControls todoStatus={todoStatus} onSelect={handleStatusSelect} />

      {completedTodos.length
        ? (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={onDelete}
          >
            Clear completed
          </button>
        )
        : (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          />
        )}
    </footer>
  );
};
