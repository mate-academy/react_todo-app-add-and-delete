import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';

export type TodoListProps = {
  todos: Todo[]
  setErrorText: (error: string) => void
  removeOnResponse:(id:number) => void
  listToRemove: number[]
  setDelited: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoList = ({
  todos, setErrorText, removeOnResponse, listToRemove, setDelited,
}: TodoListProps) => {
  const [removeId, setRemoveId] = useState<number>(-1);

  const remove = (id: number) => {
    setRemoveId(id);
    removeTodo(id)
      .then(() => removeOnResponse(id))
      .catch(() => {
        setErrorText('Unable to delete a todo');
      })
      .finally(() => {
        setRemoveId(-1);
        setDelited((prev) => prev + 1);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((({ id, completed, title }) => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed })}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => remove(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay',
              { 'is-active': id === removeId || listToRemove.includes(id) })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )))}
    </section>
  );
};
