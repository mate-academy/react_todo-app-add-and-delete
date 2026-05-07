import React from 'react';

type Props = {
  todo: {
    title: string;
  };
};

export const TempTodo: React.FC<Props> = ({ todo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
