import React from 'react';

export const TodoLoader: React.FC = () => {
  /* 'is-active' class puts this modal on top of the todo */

  return (
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
