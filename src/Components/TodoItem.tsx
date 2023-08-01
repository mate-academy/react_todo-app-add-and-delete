import classNames from 'classnames';
// import { useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, removeTodo } from '../api/todos';
import { ErrorStatus } from '../types/ErrorStatus';
import { USER_ID } from '../utils/constants';

interface Props {
  todo: Todo,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
  loading: boolean,
  completedIds: number[],
  setCompletedIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  loading,
  completedIds,
  setCompletedIds,
}) => {
  const handleDelete = (todoId: number) => {
    setCompletedIds(currIds => [...currIds, todoId]);

    removeTodo(todoId)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setCompletedIds(currIds => currIds.filter(id => todoId !== id));
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Delete);
      });
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        х
      </button>

      {false && (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div className={
        classNames('modal overlay',
          // eslint-disable-next-line max-len
          { 'is-active': todo.id === 0 || completedIds.includes(todo.id) || loading })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
