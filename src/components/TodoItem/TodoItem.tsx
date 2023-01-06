import React from 'react';
import cn from 'classnames';

import { TodoLoader } from '../TodoLoader/TodoLoader';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  temporary?: boolean;
  isTodoDeleting?: boolean;
  selectedTodoId?: number[];
  onDelete?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    temporary = false,
    isTodoDeleting,
    selectedTodoId,
    onDelete = () => {},
  } = props;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {(temporary || (isTodoDeleting && selectedTodoId?.includes(todo.id))) && (
        <TodoLoader />
      )}
    </div>
  );
};
