import React from 'react';

export const Loader: React.FC = () => (
  <div className="todo__loader" data-cy="TodoLoader">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
