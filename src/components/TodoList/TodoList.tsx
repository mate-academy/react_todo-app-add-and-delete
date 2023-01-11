import cn from 'classnames';
import { useState } from 'react';
import { deleteTodo } from '../../api/todos';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      {todos && (
        todos.map(todo => (
          <div
            data-cy="Todo"
            className={!isDeleting ? (
              cn('todo', { active: todo.completed })) : ('')}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setIsDeleting(true);
                deleteTodo(todo.id);
                onDelete(todo.id);
                setIsDeleting(false);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', { isDeleting: 'is-active' })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )))}
    </>
  );
};
