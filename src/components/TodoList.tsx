import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { TodoModal } from './TodoModal';

type Props = {
  todos: Todo[],
  onSubmit: (todo: Todo) => void
  onRemove: (todoId: number) => void
  userId: number
};

export const TodoList: React.FC<Props> = ({
  todos,
  onSubmit,
  onRemove,
  userId,
}) => {
  const [editing, setEditing] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(0);

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

          {todo.id !== selectedTodoId
            ? (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditing(true);
                    setSelectedTodoId(todo.id);
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
                  }}
                >
                  ×
                </button>
              </>
            )
            : (
              <>
                <Form
                  todo={todo}
                  onSubmit={onSubmit}
                  todos={todos}
                  userId={userId}
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
