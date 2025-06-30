import React from 'react';

type Props = {
  isLoading: boolean;
};
export const Loader: React.FC<Props> = ({ isLoading = false }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
