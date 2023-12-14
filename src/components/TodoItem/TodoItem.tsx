import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (id: number[]) => void,
  deletedTodo?: number | null,
  setTodos: (t: Todo[]) => void
  todos: Todo[],
};
export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  deletedTodo,
  setTodos,
  todos,
}) => {
  const handleChangeStatusTodo = () => {
    setTodos(todos.map(item => (
      item.id === todo.id
        ? {
          ...item,
          completed: !item.completed,
        }
        : item
    )));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleChangeStatusTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          removeTodo([todo.id]);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || todo.id === deletedTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
