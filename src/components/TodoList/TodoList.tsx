import React, { SetStateAction, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodoTitle?: string;
  deletingTodoIds: number[];
  setDeletingTodoIds: React.Dispatch<SetStateAction<number[]>>
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodoTitle,
  deletingTodoIds,
  setDeletingTodoIds,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(prevIds => [
      ...prevIds,
      todoId,
    ]);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo, index) => {
        return (
          <div
            key={todo.id}
            className={cn(
              'todo',
              { completed: todo.completed },
            )}
            role="button"
            tabIndex={index}
            onDoubleClick={() => setSelectedTodoId(todo.id)}
            onKeyUp={() => {}}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {}}
              />
            </label>

            {selectedTodoId !== todo.id ? (
              <span className="todo__title">{todo.title}</span>
            ) : (
              <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={todo.title}
                />
              </form>
            )}

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>

            <div className={cn(
              'modal overlay',
              { 'is-active': deletingTodoIds.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodoTitle && (
        <div className="todo temp-item-enter temp-item-enter-active">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodoTitle}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
