import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleCompletedStatus: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  handleFormSubmitEdited: (
    event: React.FormEvent<HTMLFormElement>,
    editTodo: Todo) => void;
  idCompleatedArr: number[];
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleCompletedStatus,
  handleDelete,
  handleFormSubmitEdited,
  idCompleatedArr,
}) => {
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const handleDoubleClick = (chosenTodo: Todo) => {
    setEditTodo(chosenTodo);
    setEditTitle(chosenTodo.title);
  };

  const handleEditTodo: React.ChangeEventHandler<HTMLInputElement>
  = (event) => {
    setEditTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedStatus(todo)}
        />
      </label>

      {editTodo?.id === todo.id
        ? (
          <form
            onSubmit={(event) => {
              handleFormSubmitEdited(
                event, { ...editTodo, title: editTitle },
              );
              setEditTodo(null);
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={
                (event) => handleEditTodo(event)
              }
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(todo)}
            >
              {editTitle || todo.title}
            </span>

            {!editTodo && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal', 'overlay', {
                'is-active': idCompleatedArr.includes(todo.id)
                || (todo.id === editTodo?.id && !!editTodo),
              })}
            >
              <div
                className="modal-background has-background-white-ter"
              />
              <div className="loader" />
            </div>
          </>

        )}

      {/* overlay will cover the todo while it is being updated */}

    </div>
  );
};
