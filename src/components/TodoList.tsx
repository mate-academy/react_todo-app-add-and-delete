import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { TodoModal } from './TodoModal';

type Props = {
  todos: Todo[],
  title: string
  setTitle: (title: string) => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onRemove: (todoId: number) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  onSubmit,
  onRemove,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
              id="todo_selected"
              checked={todo.completed}
            />
          </label>

          {editing
            ? (
              <Form
                title={title}
                onSubmit={onSubmit}
                setTitle={setTitle}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
              />
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditing(true);
                  }}
                  onSubmit={() => {
                    setEditing(false);
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
          {editing && (
            <TodoModal
              editing={editing}
            />
          )}
        </div>
      ))}
    </section>
  );
};
