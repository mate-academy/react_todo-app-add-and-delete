/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number | null) => void;
  tempTodo: Todo | null;
  idDeletedTodo: number | null;
};

export const TodoList: React.FC<Props> = (props: Props) => {
  const { todos, onDeleteTodo, tempTodo, idDeletedTodo } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked={completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDeleteTodo(id);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': idDeletedTodo === id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/*#region CodeTodo*/}
      {/*/!* This is a completed todo *!/*/}
      {/*<div data-cy="Todo" className="todo completed">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*      checked*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Completed Todo*/}
      {/*  </span>*/}

      {/*  /!* Remove button appears only on hover *!/*/}
      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  /!* overlay will cover the todo while it is being deleted or updated *!/*/}
      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* This todo is an active todo *!/*/}
      {/*<div data-cy="Todo" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Not Completed Todo*/}
      {/*  </span>*/}
      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* This todo is being edited *!/*/}
      {/*<div data-cy="Todo" className="todo">*/}
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
      {/*      value="Todo is being edited now"*/}
      {/*    />*/}
      {/*  </form>*/}

      {/*  <div data-cy="TodoLoader" className="modal overlay">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* This todo is in loadind state *!/*/}
      {/*<div data-cy="Todo" className="todo">*/}
      {/*  <label className="todo__status-label">*/}
      {/*    <input*/}
      {/*      data-cy="TodoStatus"*/}
      {/*      type="checkbox"*/}
      {/*      className="todo__status"*/}
      {/*    />*/}
      {/*  </label>*/}

      {/*  <span data-cy="TodoTitle" className="todo__title">*/}
      {/*    Todo is being saved now*/}
      {/*  </span>*/}

      {/*  <button type="button" className="todo__remove" data-cy="TodoDelete">*/}
      {/*    ×*/}
      {/*  </button>*/}

      {/*  /!* 'is-active' class puts this modal on top of the todo *!/*/}
      {/*  <div data-cy="TodoLoader" className="modal overlay is-active">*/}
      {/*    <div className="modal-background has-background-white-ter" />*/}
      {/*    <div className="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*#endregion*/}
    </section>
  );
};
