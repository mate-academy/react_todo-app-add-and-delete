import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { actions } from '../helpers/reducer';
import { TodosContext } from '../TodosContext';
import { Todo } from '../types/Todo';
import * as todosServise from '../api/todos';

type Props = {
  todo: Todo,
  isSubmitting: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, isSubmitting }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { dispatch, setErrorMessage } = useContext(TodosContext);

  const deletingId = useRef<number>(0);

  const onDelete = (todoId: number) => {
    deletingId.current = todoId;
    setErrorMessage('');
    setIsDeleting(true);
    todosServise.deleteTodos(todoId)
      .then(() => {
        dispatch(actions.delete(todoId));
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsDeleting(false));
  };

  const onToggleChecked = (todoId: number) => {
    dispatch(actions.isCheckedTodo(todoId));
  };

  const isActive = (isDeleting && deletingId.current === todo.id)
    || (isSubmitting && deletingId.current === todo.id);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleChecked(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': isActive,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
