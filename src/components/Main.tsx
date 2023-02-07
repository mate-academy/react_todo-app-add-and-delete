import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[],
  isEditing: boolean,
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  loadingTodoIds: number[],
};

export const Main: React.FC<Props> = ({
  filteredTodos,
  isEditing,
  deleteTodo,
  tempTodo,
  loadingTodoIds,
}) => (
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
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}
        <div
          className={cn(
            'modal overlay',
            { 'is-active': loadingTodoIds.includes(todo.id) },
          )}
        >
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
    </div> */}

    {/* This todo is in loadind state */}
    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{tempTodo.title}</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}

  </section>
);
