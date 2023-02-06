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
  onSetLoading: (value: boolean) => void
  isLoading: boolean
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  onSubmit,
  onRemove,
  onSetLoading,
  isLoading,
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
              checked={todo.completed}
            />
          </label>

          {!editing
            ? (
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
                  onClick={() => {
                    onRemove(todo.id);
                    onSetLoading(true);
                  }}
                >
                  ×
                </button>
              </>
            )
            : (
              <>
                <Form
                  title={title}
                  onSubmit={onSubmit}
                  setTitle={setTitle}
                  isLoading={isLoading}
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                />

                <TodoModal
                  editing={editing}
                />
              </>
            )}
        </div>
      ))}
    </section>
  );
};
