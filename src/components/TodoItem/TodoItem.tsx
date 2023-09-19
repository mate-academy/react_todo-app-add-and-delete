/* eslint-disable import/no-cycle */
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../context/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [inProcess, setInProcess] = useState(false);
  const { onDeleteTodo } = useContext(TodosContext);

  return (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        onClick={() => {
          setInProcess(true);
          onDeleteTodo(todo.id);
        }}
        type="button"
        className="todo__remove"
      >
        ×
      </button>

      {inProcess ? (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ) : (
        <div className="modal overlay">
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
