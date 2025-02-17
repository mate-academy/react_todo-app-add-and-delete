import React from 'react';

export const TodoLoader: React.FC = () => {
  // is-active is the class to active loading state of this guy.

  return (
    <div data-cy="TodoLoader" className="modal overlay ">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
