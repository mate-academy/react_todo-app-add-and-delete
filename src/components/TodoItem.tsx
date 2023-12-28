import React, {
  useContext, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorContext, ErrorsMessageContext } from './ErrorsContext';
import { deleteTodoItem } from '../api/todos';
import { IsfinallyContext } from './TempTodoContext';

type Props = {
  todo: Todo ;
  clearedTodoId:number[]
};
export const TodoItem : React.FC<Props> = ({ todo, clearedTodoId }) => {
  const { setErrorsMesage } = useContext(ErrorsMessageContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const [onEdit, setOnEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { setIsfinally } = useContext(IsfinallyContext);
  const [todoId, setTodoId] = useState<number[]>([]);

  const deleteTodo = () => {
    setTodoId([todo.id]);
    setIsfinally(true);
    if (isError) {
      setIsError(false);
    }

    deleteTodoItem(todo.id)
      .catch(() => {
        setIsError(true);
        setErrorsMesage('delete');
      })
      .finally(() => {
        setIsfinally(false);
      });
  };

  const updateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (isError) {
      setIsError(false);
    }

    setIsError(true);
    setErrorsMesage('update');
  };

  const handleDoubleClick = () => {
    setOnEdit(true);
  };

  const handleCancelEdit = () => {
    setOnEdit(false);
    setEditedTitle(todo.title);
  };

  useEffect(() => {
    setTodoId(clearedTodoId);
  }, [clearedTodoId]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {onEdit ? (
        <form onSubmit={updateTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleCancelEdit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onMouseDown={deleteTodo}
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        // eslint-disable-next-line max-len
        className={cn('modal overlay', { 'is-active': todoId.some(el => el === todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
