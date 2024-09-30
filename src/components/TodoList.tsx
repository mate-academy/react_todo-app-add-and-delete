import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  renderedList: Todo[];
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todos: Todo[]) => void;
  forClear: number[] | null;
  onError: (error: Error) => void;
  setForClear: (todoIds: number[] | null) => void;
  handleDelete: (val: number) => void;
}

export const TodoList: React.FC<Props> = ({
  renderedList,
  tempTodo,
  onError,
  forClear,
  setForClear,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {renderedList.map(({ id, title, completed }) => (
        <TodoItem
          title={title}
          status={completed}
          key={id}
          id={id}
          onError={onError}
          forClear={forClear}
          setForClear={setForClear}
          handleDelete={handleDelete}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              value={tempTodo.title}
              aria-label="Todo input field"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', { 'is-active': true })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/*/!* This todo is being edited *!/*/}
      {/*<div data-cy="TodoItem.tsx" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  /!* This form is shown instead of the title and remove button *!/*/}
      {/*  <form>*/}
      {/*    <input*/}
      {/*      data-cy="TodoTitleField"*/}
      {/*      type="text"*/}
      {/*      className="todo__title-field"*/}
      {/*      placeholder="Empty todo will be deleted"*/}
      {/*      value="TodoItem.tsx is being edited now"*/}
      {/*    />*/}
      {/*  </form>*/}

      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </section>
  );
};
