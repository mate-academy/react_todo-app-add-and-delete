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

/*
      {/* This todo is in loadind state }
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        {/* 'is-active' class puts this modal on top of the todo }
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is not completed }
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Not Completed Todo
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This is a completed todo }
      <div data-cy="Todo" className="todo completed">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Completed Todo
        </span>

        {/* Remove button appears only on hover }
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        {/* overlay will cover the todo while it is being updated }
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited }
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button }
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
*/
