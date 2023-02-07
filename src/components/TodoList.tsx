import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { TodoModal } from './TodoModal';

type Props = {
  todos: Todo[],
  onRemove?: (todoId: number) => void
  userId: number
  onTodoUpdate?: (todo: Todo) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove = () => { },
  userId,
  onTodoUpdate = () => { },
}) => {
  const [editing, setEditing] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        todo.id === selectedTodoId
          ? (
            <>
              <Form
                todo={todo}
                onSubmit={(updated: Todo) => {
                  onTodoUpdate(updated);
                  setSelectedTodoId(0);
                }}
                todos={todos}
                userId={userId}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
              />

              <TodoModal
                editing={editing}
              />
            </>
          )
          : (
            <>
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
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditing(true);
                    setSelectedTodoId(todo.id);
                    setTimeout(() => {
                      setEditing(false);
                    }, 300);
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
              </div>
            </>
          )
      ))}
    </section>
  );
};
