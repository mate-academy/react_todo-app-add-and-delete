/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useContext, useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/todo/TodoContext';

interface TodoItemProps extends Todo {
  isTempTodoLoading?: boolean;
}

export const TodoItem: FC<TodoItemProps> = ({
  completed,
  id,
  title,
  isTempTodoLoading = false,
}) => {
  const { setIsLoading } = useContext(TodoContext);

  const [isTodoItemLoading, setIsTodoItemLoading] = useState(false);

  const onTodoDelete = () => {
    setIsTodoItemLoading(true);
    deleteTodo(id)
      .then(() => setIsLoading(true))
      .finally(() => {
        setIsTodoItemLoading(false);
      });
  };

  const isCompletedToggle = () => {
    setIsTodoItemLoading(true);
    updateTodo({
      id: id,
      updatedFields: {
        completed: !completed,
      },
    })
      .then(() => setIsLoading(true))
      .finally(() => {
        setIsTodoItemLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={isCompletedToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onTodoDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isTodoItemLoading || isTempTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
