import classNames from 'classnames';
import { useContext, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id, title, completed,
  } = todo;

  const {
    isSubmiting,
    deleteTodo,
  } = useContext(TodosContext);

  // const [isEdit, setIsEdit] = useState(false);
  const isEdit = false;
  const [editTitle, setEditTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  const handleTodoDelete = (todoId : number) => {
    deleteTodo(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEdit ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleField}
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}

          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': isSubmiting && !todo.id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
