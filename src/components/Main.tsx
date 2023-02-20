import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
  processedTodos: number[];
};

export const Main: React.FC<Props> = ({
  todos,
  onRemove,
  onTodoUpdate,
  processedTodos,
}) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTodo((prevEditingTodo: Todo | null) => {
      if (!prevEditingTodo) {
        return null;
      }

      return {
        ...prevEditingTodo,
        title: event.target.value,
        id: prevEditingTodo?.id,
      };
    });
  };

  const handleBlur = () => {
    if (!editingTodo?.title) {
      onRemove(editingTodo?.id as number);
    } else {
      onTodoUpdate(editingTodo as Todo);
    }

    setEditingTodo(null);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const isEditing = editingTodo?.id === todo.id;

        return (
          <div
            key={todo.id}
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  onTodoUpdate({ ...todo, completed: !todo.completed });
                }}
              />
            </label>
            {isEditing ? (
              <form onSubmit={handleBlur}>
                <input
                  type="text"
                  placeholder="Empty title will be deleted"
                  className="todo__title-field"
                  value={editingTodo?.title || ''}
                  onBlur={handleBlur}
                  onChange={handleTitleChange}
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodo(todo);
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onRemove(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              className={classNames('modal overlay', {
                'is-active': processedTodos.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
