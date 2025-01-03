import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodos } from '../../api/todos';

interface Props {
  todoList: Todo[];
  setError: (error: string) => void;
  setTodoList: (todos: Todo[]) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todoList,
  setError,
  setTodoList,
  tempTodo,
}) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDeleteTodo = async (id: number) => {
    setLoadingId(id);

    try {
      await deleteTodos(id);

      setTodoList(todoList.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
          {loadingId === todo.id && (
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {tempTodo && (
        <div className="todo">
          <span className="todo__title">{tempTodo.title}</span>
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
