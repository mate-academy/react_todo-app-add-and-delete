import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  activeTodo: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  completeTodo: (todo: Todo) => void;
  setActiveTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodosList: React.FC<Props> = ({
  todos,
  activeTodo,
  tempTodo,
  deleteTodo,
  completeTodo,
  setActiveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => completeTodo(todo)}
              />
            </label>
            {/* eslint-enable jsx-a11y/label-has-associated-control */}

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                deleteTodo(todo.id);
                setActiveTodo([todo]);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': activeTodo.includes(todo),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div key={tempTodo.id} data-cy="Todo" className="todo">
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          {/* eslint-enable jsx-a11y/label-has-associated-control */}

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

      {/* This todo is an active todo */}
      {/* <div data-cy="Todo" className="todo">
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
                       </div> */}

      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo"> */}
      {/* <label className="todo__status-label">
                           <input
                             data-cy="TodoStatus"
                             type="checkbox"
                             className="todo__status"
                           />
                         </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
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
                         </div> */}
      {/* </div> */}

      {/* This todo is in loadind state */}
      {/* <div data-cy="Todo" className="todo"> */}
      {/* <label className="todo__status-label">
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
                         </button> */}

      {/* 'is-active' class puts this modal on top of the todo */}
      {/* <div data-cy="TodoLoader" className="modal overlay is-active">
                           <div className="modal-background has-background-white-ter" />
                           <div className="loader" />
                         </div> */}
      {/* </div> */}
    </section>
  );
};
