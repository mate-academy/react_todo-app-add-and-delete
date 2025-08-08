import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  deleteTodo: (userId: number) => Promise<void>;
  changeTodo: (
    todoId: number,
    title: string,
    complet: boolean,
  ) => Promise<void>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  changeTodo,
}) => {
  const [isEditingId, setIsEditingId] = useState(0);
  const [title, setTitle] = useState('');
  const [isLoadingId, setIsLoadingId] = useState(0);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(item => (
        <div
          data-cy="Todo"
          className={`todo${item.completed ? ' completed' : ''}`}
          key={item.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${item.id}`}
          >
            <span className="visually-hidden">Позначити як виконане</span>
            <input
              id={`todo-status-${item.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={item.completed}
              onChange={() => {
                setIsLoadingId(item.id);
                changeTodo(item.id, item.title, !item.completed).finally(() => {
                  setIsLoadingId(0);
                });
              }}
            />
          </label>
          {(item.id === 0 || isEditingId !== item.id) && (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditingId(item.id);
                setTitle(item.title);
              }}
            >
              {item.title}
            </span>
          )}

          {isEditingId === item.id && (
            <form
              onSubmit={() => {
                setIsLoadingId(item.id);
                changeTodo(item.id, title, item.completed).finally(() => {
                  setIsLoadingId(0);
                });
                setIsEditingId(0);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
            </form>
          )}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${isLoadingId === item.id ? 'is-active' : 'hidden'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsLoadingId(item.id);
              deleteTodo(item.id).finally(() => {
                setIsLoadingId(0);
              });
            }}
          >
            ×
          </button>
        </div>
      ))}
    </section>
  );
};
