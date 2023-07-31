/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../context/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { deleteLoading, onDeleteTodo, deletingTodoId }
  = useContext(TodosContext);

  return (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        onClick={() => onDeleteTodo(todo.id)}
        type="button"
        className="todo__remove"
      >
        ×
      </button>

      {deletingTodoId === todo.id && deleteLoading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
