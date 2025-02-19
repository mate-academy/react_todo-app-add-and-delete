/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import Loader from './Loader';

type Props = {
  todo?: Todo;
  loading: boolean;
  requestMethod: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | null;
  selectedTodoId?: number | null;
  setSelectedTodoId: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo?: Todo;
};

const TodoItem: React.FC<Props> = ({
  todo,
  setSelectedTodoId,
  selectedTodoId,
  requestMethod,
  loading,
  handleDelete,
  tempTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo?.completed && 'completed'} `}
      onClick={() => todo && setSelectedTodoId(todo.id)}
    >
      {/* This is a completed todo */}

      <label className="todo__status-label">
        <input
          name="completed"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed || tempTodo?.completed}
          // onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo?.title.trim() || tempTodo?.title.trim()}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => todo && handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loader
        loading={loading}
        requestMethod={requestMethod}
        selectedTodoId={selectedTodoId}
        todo={todo}
        tempTodo={tempTodo}
      />
    </div>
  );
};

export default TodoItem;
