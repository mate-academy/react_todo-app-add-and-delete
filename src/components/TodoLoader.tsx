import React from 'react';

interface Props {
  isLoading: boolean;
}

export const TodoLoader: React.FC<Props> = ({ isLoading }) => (
  <div
    data-cy="TodoLoader"
    className={`modal overlay ${isLoading ? 'is-active' : ''}`}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
