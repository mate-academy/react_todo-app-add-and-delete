import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[],
  isEditing: boolean,
  onRemove: (todoId: number) => void,
};

export const Main: React.FC<Props> = ({
  filteredTodos,
  isEditing,
  onRemove,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          className={cn(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          {isEditing
            ? (
              <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value="Todo is being edited now"
                />
              </form>
            )
            : (
              <>
                <span className="todo__title">{todo.title}</span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onRemove(todo.id)}
                >
                  ×
                </button>
              </>
            )}
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {/* This todo is being edited
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      This todo is in loadind state
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button>

        'is-active' class puts this modal on top of the todo
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
