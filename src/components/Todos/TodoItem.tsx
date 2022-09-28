import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodoToState: (todoId: number) => void;
  changeError: (value: ErrorTypes | null) => void;
  todosInProcess: number[] | null;
}

const TodoItem:React.FC<Props> = ({
  todo,
  deleteTodoToState,
  changeError,
  todosInProcess,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteItem = async () => {
    setIsDeleting(true);

    await deleteTodo(todo.id)
      .then(() => deleteTodoToState(todo.id))
      .catch(() => changeError(ErrorTypes.Delete))
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={deleteItem}
      >
        ×
      </button>

      {/* <div data-cy="TodoLoader" className="modal overlay"> */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isDeleting || todosInProcess?.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
